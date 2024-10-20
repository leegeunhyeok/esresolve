import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { Plugin } from 'esbuild';
import { createEntryScript } from './create-entry-script';
import type { ResolveResult } from './types';

const RESOLVING = Symbol('resolving');
const ENTRY_NAMESPACE = 'entry';

interface ResolvePluginOptions {
  entryPoint: string;
  requests?: string[];
  callback: (dependencies: ResolveResult[], errors: string[]) => void;
}

export function createResolvePlugin({
  entryPoint,
  requests,
  callback,
}: ResolvePluginOptions): Plugin {
  const dependencies: ResolveResult[] = [];
  const errors: string[] = [];

  return {
    name: 'resolve-plugin',
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (args.kind === 'entry-point') {
          return { path: args.path, namespace: ENTRY_NAMESPACE };
        }

        // To avoid recursive resolving
        if (args.pluginData === RESOLVING) {
          return null;
        }

        const originalPath = args.path;
        const result = await build.resolve(args.path, {
          importer: args.importer,
          kind: args.kind,
          resolveDir: path.dirname(entryPoint),
          pluginData: RESOLVING,
        });

        result.errors.length
          ? result.errors.forEach(({ text }) => errors.push(text))
          : dependencies.push({ path: result.path, request: originalPath });
      });

      build.onLoad(
        { filter: /.*/, namespace: ENTRY_NAMESPACE },
        async (args) =>
          Array.isArray(requests)
            ? { loader: 'ts', contents: createEntryScript(requests) }
            : {
                loader: /.ts?x$/.test(args.path) ? 'tsx' : 'jsx',
                contents: await fs.readFile(args.path, 'utf-8'),
              },
      );

      build.onEnd(() => {
        callback(
          dependencies,
          [
            dependencies.length === 0 ? 'result is empty' : undefined,
            ...errors,
          ].filter(Boolean) as string[],
        );
      });
    },
  };
}

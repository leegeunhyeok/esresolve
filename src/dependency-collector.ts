import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import type { Plugin } from 'esbuild';
import type { ResolveResult } from './types';

const RESOLVING = Symbol('esresolve::resolving');
const ENTRY_NAMESPACE = 'entry';

type ResultCallback = (dependencies: ResolveResult[], errors: string[]) => void;

export function createDependencyCollector(callback: ResultCallback): Plugin {
  const dependencies: ResolveResult[] = [];
  const errors: string[] = [];

  return {
    name: 'dependency-collector',
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        // To avoid recursive resolving
        if (args.pluginData === RESOLVING) {
          return;
        }

        const originalPath = args.path;
        const result = await build.resolve(args.path, {
          resolveDir: args.resolveDir || path.dirname(args.importer),
          importer: args.importer,
          kind: args.kind,
          pluginData: RESOLVING,
        });

        if (result.errors.length) {
          result.errors.forEach(({ text }) => errors.push(text));
          return;
        }

        if (args.kind === 'entry-point') {
          return { path: result.path, namespace: ENTRY_NAMESPACE };
        }

        dependencies.push({ path: result.path, request: originalPath });
      });

      build.onLoad(
        { filter: /.*/, namespace: ENTRY_NAMESPACE },
        async (args) => ({
          loader: /.ts?x$/.test(args.path) ? 'tsx' : 'jsx',
          contents: await fs.readFile(args.path, 'utf-8'),
        }),
      );

      build.onEnd(() => callback(dependencies, errors));
    },
  };
}

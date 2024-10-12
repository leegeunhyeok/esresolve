import * as path from 'node:path';
import type { Plugin } from 'esbuild';
import { createEntryScript } from './create-entry-script';
import type { ResolveResult } from './types';

const RESOLVING = Symbol('resolving');
const ENTRY_NAMESPACE = 'entry';

export function createResolvePlugin(
  entryPoint: string,
  requests: string[],
  callback: (dependencies: ResolveResult[], hasError: boolean) => void,
): Plugin {
  const dependencies: ResolveResult[] = [];
  let hasError = false;

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

        if ((hasError ||= Boolean(result.errors.length))) {
          return null;
        }

        dependencies.push({ path: result.path, request: originalPath });
      });

      build.onLoad({ filter: /.*/, namespace: ENTRY_NAMESPACE }, () => {
        return { contents: createEntryScript(requests), loader: 'ts' };
      });

      build.onEnd(() => {
        callback(dependencies, hasError || dependencies.length === 0);
      });
    },
  };
}

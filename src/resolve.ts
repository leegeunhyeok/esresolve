import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { createResolvePlugin } from './resolve-plugin';
import type { ResolveOptions, ResolveResult } from './types';

/**
 * Resolve the module(s) from the specified path.
 * You can resolve a single module or multiple modules simultaneously.
 *
 * @param baseDir - Base path for resolving modules.
 * @param request - Module path to resolve.
 * @param options - Resolver options.
 */
export async function resolve(
  baseDir: string,
  request: string | string[],
  options?: ResolveOptions,
): Promise<ResolveResult[]> {
  const entryPoint = path.resolve(baseDir, 'entry.ts');
  const requests = Array.isArray(request) ? request : [request];

  return new Promise<ResolveResult[]>((resolve, reject) => {
    esbuild
      .build({
        entryPoints: [entryPoint],
        absWorkingDir: options?.root,
        resolveExtensions: options?.extensions,
        conditions: options?.conditionNames,
        mainFields: options?.mainFields,
        alias: options?.alias,
        tsconfig: options?.tsconfig,
        tsconfigRaw: options?.tsconfigRaw,
        write: false,
        metafile: false,
        treeShaking: false,
        bundle: true,
        logLevel: 'silent',
        plugins: [
          createResolvePlugin(
            entryPoint,
            requests,
            (dependencies, hasError) => {
              hasError
                ? reject(new Error(`cannot resolve ${requests.join(', ')}`))
                : resolve(dependencies);
            },
          ),
        ],
      })
      .catch(reject);
  });
}

/**
 * Return a resolve function with the provided options applied.
 *
 * @param options - Resolver options.
 */
resolve.create = function create(options?: ResolveOptions) {
  return (baseDir: string, request: string | string[]) =>
    resolve(baseDir, request, options);
};

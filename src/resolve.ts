import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { createResolvePlugin } from './resolve-plugin';
import type { ResolveOptions, ResolveResult } from './types';
import { toBuildOptions } from './to-build-options';

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
    const resolvePlugin = createResolvePlugin({
      entryPoint,
      requests,
      callback: (dependencies, errors) => {
        errors.length
          ? reject(new Error(`cannot resolve modules\n\n${errors.join('\n')}`))
          : resolve(dependencies);
      },
    });

    esbuild
      .build({
        ...toBuildOptions(entryPoint, options),
        entryPoints: [entryPoint],
        plugins: [resolvePlugin],
        write: false,
        metafile: false,
        treeShaking: false,
        bundle: true,
        logLevel: 'silent',
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

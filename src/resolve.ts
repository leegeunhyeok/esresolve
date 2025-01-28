import { createVirtualEntry } from './create-virtual-entry';
import type { ResolveOptions, ResolveResult } from './types';
import { toBuildOptions } from './to-build-options';
import { prepareResolve } from './prepare-resolve';

/**
 * Resolve the module(s) from the specified path.
 * You can resolve a single module or multiple modules simultaneously.
 *
 * @param baseDir - Base path for resolving modules.
 * @param request - Module path to resolve.
 * @param options - Resolver options.
 */
export function resolve(
  baseDir: string,
  request: string | string[],
  options?: ResolveOptions,
): Promise<ResolveResult[]> {
  const requests = Array.isArray(request) ? request : [request];

  return prepareResolve({
    ...toBuildOptions(options),
    stdin: createVirtualEntry(baseDir, requests),
  })();
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

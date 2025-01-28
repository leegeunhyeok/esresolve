import * as path from 'node:path';
import { toBuildOptions } from './to-build-options';
import type { ResolveOptions, ResolveResult } from './types';
import { prepareResolve } from './prepare-resolve';

/**
 * Resolve the module(s) from the specified module.
 *
 * @param targetModule - Module path to resolve its dependencies.
 * @param options - Resolver options.
 */
export function resolveFrom(
  targetModule: string,
  options?: ResolveOptions,
): Promise<ResolveResult[]> {
  const resolvedModulePath = path.resolve(
    options?.root ?? process.cwd(),
    targetModule,
  );

  return prepareResolve({
    ...toBuildOptions(options),
    entryPoints: [resolvedModulePath],
  })();
}

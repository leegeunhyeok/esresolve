import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { createResolvePlugin } from './resolve-plugin';
import { toBuildOptions } from './to-build-options';
import type { ResolveOptions, ResolveResult } from './types';

/**
 * Resolve the module(s) from the specified module.
 *
 * @param targetModule - Module path to resolve its dependencies.
 * @param options - Resolver options.
 */
export async function resolveFrom(
  targetModule: string,
  options?: ResolveOptions,
): Promise<ResolveResult[]> {
  const resolvedModulePath = path.resolve(
    options?.root ?? process.cwd(),
    targetModule,
  );

  return new Promise<ResolveResult[]>((resolve, reject) => {
    const resolvePlugin = createResolvePlugin({
      entryPoint: resolvedModulePath,
      callback: (dependencies, errors) => {
        errors.length
          ? reject(
              new Error(
                `cannot resolve module(s) from ${targetModule}\n\n${errors.join(
                  '\n',
                )}`,
              ),
            )
          : resolve(dependencies);
      },
    });

    esbuild
      .build({
        ...toBuildOptions(resolvedModulePath, options),
        entryPoints: [resolvedModulePath],
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

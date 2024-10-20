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
  return new Promise<ResolveResult[]>((resolve, reject) => {
    const resolvePlugin = createResolvePlugin({
      entryPoint: targetModule,
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
        ...toBuildOptions(targetModule, options),
        entryPoints: [targetModule],
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
import type { BuildOptions } from 'esbuild';
import type { ResolveOptions } from './types';

export function toBuildOptions(
  entryPoint: string,
  options?: ResolveOptions,
): BuildOptions {
  return {
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
  };
}

import type { BuildOptions } from 'esbuild';
import type { ResolveOptions } from './types';

export function toBuildOptions(options?: ResolveOptions): BuildOptions {
  return {
    absWorkingDir: options?.root,
    resolveExtensions: options?.extensions,
    conditions: options?.conditionNames,
    mainFields: options?.mainFields,
    alias: options?.alias,
    tsconfig: options?.tsconfig,
    tsconfigRaw: options?.tsconfigRaw,
  };
}

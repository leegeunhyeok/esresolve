import type { BuildOptions } from 'esbuild';

export interface ResolveOptions {
  root?: string;
  extensions?: BuildOptions['resolveExtensions'];
  conditionNames?: BuildOptions['conditions'];
  mainFields?: BuildOptions['mainFields'];
  alias?: BuildOptions['alias'];
  tsconfig?: BuildOptions['tsconfig'];
  tsconfigRaw?: BuildOptions['tsconfigRaw'];
}

export interface ResolveResult {
  path: string;
  request: string;
}

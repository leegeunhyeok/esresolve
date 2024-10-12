import type { BuildOptions } from 'esbuild';

export interface ResolveOptions {
  /**
   * Specify the working directory path.
   *
   * Defaults to `current workspace path`.
   *
   * Documentation: https://esbuild.github.io/api/#working-directory
   */
  root?: string;
  /**
   * File extension of the modules to resolve.
   *
   * Defaults to `['.tsx', '.ts', '.jsx', '.js', '.css', '.json']`.
   *
   * Documentation: https://esbuild.github.io/api/#resolve-extensions
   */
  extensions?: BuildOptions['resolveExtensions'];
  /**
   * Controls how the exports field in package.json is interpreted.
   *
   * Documentation: https://esbuild.github.io/api/#conditions
   */
  conditionNames?: BuildOptions['conditions'];
  /**
   * Specify the field name to reference in package.json when importing the file.
   *
   * Documentation: https://esbuild.github.io/api/#main-fields
   */
  mainFields?: BuildOptions['mainFields'];
  /**
   * Configuration for aliasing a specified module to replace it with another module.
   *
   * Documentation: https://esbuild.github.io/api/#alias
   */
  alias?: BuildOptions['alias'];
  /**
   * Path to the `tsconfig.json` file to reference during resolution.
   *
   * Documentation: https://esbuild.github.io/api/#tsconfig
   */
  tsconfig?: BuildOptions['tsconfig'];
  /**
   * Stringified content of the `tsconfig.json` to reference during resolution.
   *
   * Documentation: https://esbuild.github.io/api/#tsconfig-raw
   */
  tsconfigRaw?: BuildOptions['tsconfigRaw'];
}

export interface ResolveResult {
  /**
   * Actual requested path (eg. `./foo`)
   */
  request: string;
  /**
   * Absolute path (eg. `/path/to/foo.js`)
   */
  path: string;
}

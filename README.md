<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./images/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./images/logo-light.svg">
    <img alt="esresolve: A powerful module resolver based on esbuild" src="./images/logo-light.svg">
  </picture>
</p>

## Usage

```ts
import { resolve, resolveFrom } from 'esresolve';

// 1. Resolve module path from base path.
await resolve('/path/to/workspace', './my-module', {
  /* options */
});

// 2. You can also resolve multiple modules.
await resolve('/path/to/workspace', ['./foo', './bar'], {
  /* options */
});

// 3. You can create a resolver with the specified options applied.
const resolver = resolve.create({
  /* options */
});
await resolver('/path/to/workspace', './my-module');

// 4. Resolve dependencies from specified module.
await resolveFrom('/path/to/module.ts', {
  /* options */
});
```

```ts
// Resolve result
const result = await resolve('/path/to/workspace', './my-module');

// <result>
// [
//   {
//     request: './my-module',
//     path: '/path/to/workspace/src/core/my-module/index.ts',
//   }
// ]
```

<details>

  <summary>Options</summary>

```ts
interface ResolveOptions {
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
```

</details>

## License

[MIT](./LICENSE)

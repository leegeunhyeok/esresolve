import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { createResolvePlugin } from './resolve-plugin';
import type { ResolveResult } from './types';

type BuildOptions = esbuild.BuildOptions;

export interface ResolveOptions {
  root?: string;
  extensions?: BuildOptions['resolveExtensions'];
  conditionNames?: BuildOptions['conditions'];
  mainFields?: BuildOptions['mainFields'];
  alias?: BuildOptions['alias'];
  tsconfig?: BuildOptions['tsconfig'];
  tsconfigRaw?: BuildOptions['tsconfigRaw'];
}

export async function resolve(
  baseDir: string,
  request: string | string[],
  options?: ResolveOptions,
): Promise<ResolveResult[]> {
  const entryPoint = path.resolve(baseDir, 'entry.ts');
  const requests = Array.isArray(request) ? request : [request];

  return new Promise<ResolveResult[]>((resolve, reject) => {
    esbuild
      .build({
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
        plugins: [
          createResolvePlugin(
            entryPoint,
            requests,
            (dependencies, hasError) => {
              hasError
                ? reject(new Error(`cannot resolve ${requests.join(', ')}`))
                : resolve(dependencies);
            },
          ),
        ],
      })
      .catch(() => void 0);
  });
}

resolve.create = function create(options?: ResolveOptions) {
  return (baseDir: string, request: string | string[]) =>
    resolve(baseDir, request, options);
};

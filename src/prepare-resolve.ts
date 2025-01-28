import * as esbuild from 'esbuild';
import { createDependencyCollector } from './dependency-collector';
import type { ResolveResult } from './types';

type PerformResolve = () => Promise<ResolveResult[]>;

export function prepareResolve(options: esbuild.BuildOptions): PerformResolve {
  const perform: PerformResolve = () =>
    new Promise<ResolveResult[]>((resolve, reject): void => {
      const collectPlugin = createDependencyCollector(
        (dependencies, errors) => {
          errors.length
            ? reject(
                new Error(`cannot resolve modules\n\n${errors.join('\n')}`),
              )
            : resolve(dependencies);
        },
      );

      esbuild
        .build({
          ...BASE_OPTIONS,
          ...options,
          plugins: [collectPlugin],
        })
        .catch(reject);
    });

  return perform;
}

const BASE_OPTIONS: esbuild.BuildOptions = {
  write: false,
  metafile: false,
  treeShaking: false,
  bundle: true,
  logLevel: 'silent',
};

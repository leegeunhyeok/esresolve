import { resolve } from 'node:path';
import * as esbuild from 'esbuild';

const COMMON_BUILD_OPTIONS: esbuild.BuildOptions = {
  entryPoints: [resolve(__dirname, '../src/index.ts')],
  platform: 'node',
  bundle: true,
  external: ['esbuild'],
};

async function build(): Promise<void> {
  await Promise.all([
    // default
    esbuild.build({
      ...COMMON_BUILD_OPTIONS,
      outdir: 'dist',
    }),
    // cjs
    esbuild.build({
      ...COMMON_BUILD_OPTIONS,
      outdir: 'cjs',
      format: 'cjs',
      outExtension: { '.js': '.cjs' },
    }),
    // esm
    esbuild.build({
      ...COMMON_BUILD_OPTIONS,
      outdir: 'esm',
      format: 'esm',
      outExtension: { '.js': '.mjs' },
    }),
  ]);
}

build().catch((error: unknown) => {
  console.error('build failed', error);
  process.exit(1);
});

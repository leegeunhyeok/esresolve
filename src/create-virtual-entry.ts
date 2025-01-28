import type * as esbuild from 'esbuild';

export function createVirtualEntry(
  baseDir: string,
  requests: string[],
): NonNullable<esbuild.BuildOptions['stdin']> {
  return {
    contents: createEntryScript(requests),
    resolveDir: baseDir,
  };
}

function createEntryScript(requests: string[]): string {
  return requests.map((source) => `import '${source}';`).join('\n');
}

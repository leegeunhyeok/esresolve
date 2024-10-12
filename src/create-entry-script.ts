export function createEntryScript(imports: string[]): string {
  return imports.map((source) => `import '${source}';`).join('\n');
}

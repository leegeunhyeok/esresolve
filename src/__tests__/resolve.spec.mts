import * as path from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from '../resolve.js';
import { ResolveResult } from '../types.js';

describe('resolve', () => {
  const ROOT = path.join(import.meta.dirname, '__fixtures__');

  function stripRootPath(results: ResolveResult[]) {
    return results.map((result) => ({
      ...result,
      path: path.relative(process.cwd(), result.path),
    }));
  }

  describe('resolve with single request', () => {
    it('should returns resolved path', async () => {
      const results = await resolve(ROOT, './a');

      expect(results.length).toEqual(1);
      expect(stripRootPath(results)).toMatchInlineSnapshot(`
        [
          {
            "path": "src/__tests__/__fixtures__/a.ts",
            "request": "./a",
          },
        ]
      `);
    });
  });

  describe('resolve with multiple requests', () => {
    it('should returns resolved paths', async () => {
      const results = await resolve(ROOT, ['./a', './b', './c']);

      expect(results.length).toEqual(3);
      expect(stripRootPath(results)).toMatchInlineSnapshot(`
        [
          {
            "path": "src/__tests__/__fixtures__/c.ts",
            "request": "./c",
          },
          {
            "path": "src/__tests__/__fixtures__/a.ts",
            "request": "./a",
          },
          {
            "path": "src/__tests__/__fixtures__/b.ts",
            "request": "./b",
          },
        ]
      `);
    });
  });
});

import * as path from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from '../resolve.js';
import { resolveFrom } from '../resolve-from.js';
import { ResolveResult } from '../types.js';

const ROOT = path.join(import.meta.dirname, '__fixtures__');

function stripRootPath(results: ResolveResult[]) {
  return results.map((result) => ({
    ...result,
    path: path.relative(process.cwd(), result.path),
  }));
}

function sort(results: ResolveResult[]) {
  return results.sort((a, b) => (a.path > b.path ? 1 : -1));
}

describe('resolve', () => {
  describe('resolve with single request', () => {
    it('should returns resolved path', async () => {
      const results = await resolve(ROOT, './a');

      expect(results.length).toEqual(1);
      expect(sort(stripRootPath(results))).toMatchInlineSnapshot(`
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
      expect(sort(stripRootPath(results))).toMatchInlineSnapshot(`
        [
          {
            "path": "src/__tests__/__fixtures__/a.ts",
            "request": "./a",
          },
          {
            "path": "src/__tests__/__fixtures__/b.ts",
            "request": "./b",
          },
          {
            "path": "src/__tests__/__fixtures__/c.ts",
            "request": "./c",
          },
        ]
      `);
    });
  });

  describe('when request with invalid source', () => {
    it('should throw error', async () => {
      expect(() => resolve(ROOT, './not-exist')).rejects.toThrow();
      expect(() => resolve(ROOT, ['./a', './not-exist'])).rejects.toThrow();
    });
  });

  describe('when `extensions` option is provided', () => {
    it('should be resolved according to the extension priority', async () => {
      const results = await resolve(ROOT, ['./a'], {
        extensions: ['.native.ts', '.ts'],
      });

      expect(results[0].path.endsWith('a.native.ts')).toBe(true);
    });
  });
});

describe('resolve.create', () => {
  let resolver: ReturnType<typeof resolve.create>;

  beforeAll(() => {
    resolver = resolve.create({});
  });

  describe('resolve with single request', () => {
    it('should returns resolved path', async () => {
      const results = await resolver(ROOT, './a');

      expect(results.length).toEqual(1);
      expect(sort(stripRootPath(results))).toMatchInlineSnapshot(`
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
      const results = await resolver(ROOT, ['./a', './b', './c']);

      expect(results.length).toEqual(3);
      expect(sort(stripRootPath(results))).toMatchInlineSnapshot(`
        [
          {
            "path": "src/__tests__/__fixtures__/a.ts",
            "request": "./a",
          },
          {
            "path": "src/__tests__/__fixtures__/b.ts",
            "request": "./b",
          },
          {
            "path": "src/__tests__/__fixtures__/c.ts",
            "request": "./c",
          },
        ]
      `);
    });
  });
});

describe('resolveFrom', () => {
  describe('resolve with single request', () => {
    it('should returns resolved path', async () => {
      const entry = path.join(ROOT, './entry.ts');
      const results = await resolveFrom(entry);

      expect(results.length).toEqual(3);
      expect(sort(stripRootPath(results))).toMatchInlineSnapshot(`
        [
          {
            "path": "src/__tests__/__fixtures__/a.ts",
            "request": "./a",
          },
          {
            "path": "src/__tests__/__fixtures__/b.ts",
            "request": "./b",
          },
          {
            "path": "src/__tests__/__fixtures__/c.ts",
            "request": "./c",
          },
        ]
      `);
    });
  });

  describe('when the target module does not have any dependencies', () => {
    it('should not throw error', async () => {
      const target = path.join(ROOT, './a.ts');

      const result = await resolveFrom(target);

      expect(result).toHaveLength(0);
    });
  });

  describe('when request with invalid source', () => {
    it('should throw error', async () => {
      const invalidEntry = path.join(ROOT, './not-exist.ts');

      expect(() => resolveFrom(invalidEntry)).rejects.toThrow();
    });
  });

  describe('when `extensions` option is provided', () => {
    it('should be resolved according to the extension priority', async () => {
      const entry = path.join(ROOT, './entry.ts');

      const results = await resolveFrom(entry, {
        extensions: ['.native.ts', '.ts'],
      });

      expect(results[0].path.endsWith('a.native.ts')).toBe(true);
    });
  });
});

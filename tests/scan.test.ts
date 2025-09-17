/**
 * Smoke test for the recursive directory scanner.
 * It should return an array and include at least this test file itself.
 */
import path from 'node:path';
import fs from 'node:fs';
import { scanDir } from '../src/client/scan';

test('scanDir returns a list of files and includes this test file', () => {
  const here = path.join(process.cwd(), 'tests');
  const list = scanDir(here);
  expect(Array.isArray(list)).toBe(true);
  const thisFile = path.join(here, 'scan.test.ts');
  // We don't assert exact equality because build tools can differ;
  // we just ensure the list contains a file ending with our name.
  expect(list.some(p => p.endsWith('scan.test.ts') || p === thisFile)).toBe(true);
});

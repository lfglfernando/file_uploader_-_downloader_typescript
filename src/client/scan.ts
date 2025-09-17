/**
 * Recursively scans a directory and returns a flat list of absolute file paths.
 * - dir: starting directory
 * Returns: string[] of file paths found under 'dir' (including nested folders).
 */
import fs from 'node:fs';
import path from 'node:path';

export function scanDir(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recurse into subdirectories and append their files
      files.push(...scanDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

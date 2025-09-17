#!/usr/bin/env node
/**
 * Minimal CLI entry point.
 * Commands:
 *   - upload <file-or-folder>
 *   - download <file-name>
 *
 * Prints friendly usage on incorrect input and exits with a non-zero code on error.
 */
import { scanDir } from './scan';
import { TransferManager } from './transferManager';
import fs from 'node:fs';

const tm = new TransferManager('http://localhost:3000');

/**
 * Parses CLI arguments and delegates to TransferManager.
 * Uses recursion (via scanDir) when uploading a folder.
 */
async function main(): Promise<void> {
  const [cmd, arg] = process.argv.slice(2);

  if (!cmd || !['upload', 'download'].includes(cmd)) {
    console.log('Usage:\n  upload <file-or-folder>\n  download <file-name>');
    process.exit(1);
  }

  if (cmd === 'upload') {
    if (!arg) throw new Error('Missing path to upload');
    const stat = fs.statSync(arg);
    // Build the list of files: either a single file or a recursive directory scan
    const files = stat.isDirectory() ? scanDir(arg) : [arg];

    console.log(`Found ${files.length} file(s). Uploading...`);
    await tm.uploadFiles(files);
  }

  if (cmd === 'download') {
    if (!arg) throw new Error('Missing file name to download');
    await tm.download(arg);
  }
}

// Top-level error handler for the CLI
main().catch(err => {
  console.error('CLI failed:', err?.message ?? err);
  process.exit(1);
});

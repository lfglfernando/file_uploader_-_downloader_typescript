/**
 * TransferManager encapsulates upload and download operations.
 * - uploadFiles(paths): uploads one or multiple files using multipart/form-data.
 * - download(name, outDir): downloads a file by name and saves it to outDir.
 *
 * Both methods are async and throw an Error on failure so callers can handle it.
 */
import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import FormData from 'form-data';

export class TransferManager {
  constructor(private baseUrl: string) {}

  /**
   * Uploads one or multiple files to the server.
   * Throws if a provided path doesn't exist or isn't a regular file.
   */
  async uploadFiles(paths: string[]): Promise<void> {
    const form = new FormData();

    for (const p of paths) {
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
        // Input validation with explicit exception
        throw new Error(`Not a valid file: ${p}`);
      }
      form.append('files', fs.createReadStream(p), path.basename(p));
    }

    try {
      const headers = form.getHeaders();
      const res = await axios.post(`${this.baseUrl}/upload`, form, { headers });
      console.log(`Uploaded: ${res.data.count} file(s)`);
      console.log('Names:', res.data.names);
    } catch (err: any) {
      // Centralized error logging and rethrow for the CLI to handle
      console.error('Upload failed:', err?.message ?? err);
      throw err;
    }
  }

  /**
   * Downloads a file by name and saves it to the specified directory.
   * Creates the target stream and pipes the HTTP response into it.
   */
  async download(name: string, outDir = '.'): Promise<void> {
    const res = await axios.get(`${this.baseUrl}/download/${encodeURIComponent(name)}`, {
      responseType: 'stream'
    });

    const outPath = path.join(outDir, name);
    await new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(outPath);
      res.data.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    console.log(`Downloaded to ${outPath}`);
  }
}

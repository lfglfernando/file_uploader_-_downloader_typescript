/**
 * Simple Express server for uploading and downloading files.
 * - POST /upload        -> accepts one or more files under "files"
 * - GET  /download/:name -> streams the file back
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const app = express();
app.use(cors());

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Multer storage configuration.
 * We type the callback signatures so TS doesn't complain about implicit any.
 */
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => cb(null, UPLOAD_DIR),

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => cb(null, file.originalname)
});

const upload = multer({ storage });

/**
 * Handles file uploads (multipart/form-data, field name: "files").
 * Note: Express' Request type doesn't include "files" by default,
 * so we cast the request to add it.
 */
app.post('/upload', upload.array('files'), (req: Request, res: Response) => {
  const files = ((req as unknown as { files?: Express.Multer.File[] }).files) ?? [];
  return res.json({
    ok: true,
    count: files.length,
    names: files.map(f => f.filename)
  });
});

/**
 * Streams a previously uploaded file to the client.
 */
app.get('/download/:name', (req: Request, res: Response) => {
  const filePath = path.join(UPLOAD_DIR, req.params.name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'File not found' });
  }
  return res.download(filePath);
});

const port = 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

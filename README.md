# File Uploader & Downloader (TypeScript)

# Copy the link to your video here: https://www.loom.com/share/fadefc4f29714b029c397acf3b2940fe


## Overview
A TypeScript CLI tool that uploads **single files** or **entire folders** (recursively) to an Express server and downloads files by name. It demonstrates:
- Terminal output
- Recursion (folder traversal)
- Classes (TransferManager)
- Lists (collections of file paths)
- Async/await
- Jest tests (additional requirement) and exception handling

## Development Environment
- Node.js 18+
- TypeScript, ts-node, Jest, Express, Multer, Axios

## How to Run
```bash
npm install

# Start the server
npm run dev:server

# Upload a single file
npm run cli -- upload ./path/to/file.png

# Upload an entire folder (recursive)
npm run cli -- upload ./my-folder

# Download a file by name (saves to current directory)
npm run cli -- download file.png

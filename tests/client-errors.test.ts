/**
 * Error-handling tests for TransferManager.
 * We stub the network layer by calling uploadFiles with an invalid path,
 * which should throw before any HTTP request is made.
 */
import { TransferManager } from '../src/client/transferManager';

test('uploadFiles throws on invalid file path', async () => {
  const tm = new TransferManager('http://localhost:3000');
  await expect(tm.uploadFiles(['./definitely/does-not-exist.bin'])).rejects.toBeTruthy();
});

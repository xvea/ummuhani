import test from 'node:test';
import assert from 'node:assert/strict';
import { jakartaDateString, prismaDate } from '../src/utils/date.js';
import { assertQueueStatus, isQueueStatus, makeTicket, QUEUE_STATUS } from '../src/utils/queue-rules.js';
import { AppError } from '../src/utils/http.js';
import { taskFieldFor } from '../src/services/task-antrian.service.js';

test('nomor tiket diformat dua digit dan mempertahankan kode poli', () => {
  assert.equal(makeTicket('A', 1), 'A-01');
  assert.equal(makeTicket('UMUM', 12), 'UMUM-12');
  assert.equal(makeTicket('UMUM', 105), 'UMUM-105');
});

test('status antrean hanya menerima status pada backlog', () => {
  assert.equal(isQueueStatus('waiting'), true);
  assert.equal(isQueueStatus('called'), true);
  assert.equal(isQueueStatus('done'), true);
  assert.equal(isQueueStatus('Dipanggil'), false);
  assert.equal(isQueueStatus('serving'), false);
});

test('assertQueueStatus menolak transisi yang tidak sesuai', () => {
  assert.doesNotThrow(() => assertQueueStatus('called', QUEUE_STATUS.CALLED, 'error'));
  assert.throws(() => assertQueueStatus('waiting', QUEUE_STATUS.CALLED, 'Antrian belum dipanggil'), (error) => {
    assert.ok(error instanceof AppError);
    assert.equal(error.status, 400);
    return true;
  });
});

test('tanggal operasional dihitung dalam zona waktu Asia/Jakarta', () => {
  assert.equal(jakartaDateString(new Date('2026-10-16T18:00:00.000Z')), '2026-10-17');
  assert.equal(prismaDate('2026-10-17').toISOString(), '2026-10-17T00:00:00.000Z');
  assert.throws(() => prismaDate('2026-02-30'), /Tanggal tidak valid/);
  assert.throws(() => prismaDate('17-10-2026'), /Format tanggal harus YYYY-MM-DD/);
});


test('AES-256-GCM encrypt/decrypt round-trip', async () => {
  process.env.DATA_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
  const { encryptSensitive, decryptSensitive } = await import('../src/utils/crypto.js');
  const secret = 'data sensitif uji';
  const encrypted = encryptSensitive(secret);
  assert.notEqual(encrypted, secret);
  assert.equal(decryptSensitive(encrypted), secret);
  assert.throws(() => decryptSensitive('malformed'), /Payload AES-256 tidak valid/);
});


test('TaskAntrian maps task number to database field and rejects invalid tasks', () => {
  assert.equal(taskFieldFor(1), 'task1');
  assert.equal(taskFieldFor(5), 'task5');
  assert.equal(taskFieldFor('7'), 'task7');
  assert.throws(() => taskFieldFor(8), (error) => error instanceof AppError && error.status === 400);
});

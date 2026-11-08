import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function encryptionKey() {
  const raw = process.env.DATA_ENCRYPTION_KEY || '';
  if (!raw) throw new Error('DATA_ENCRYPTION_KEY belum dikonfigurasi');
  let key;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) key = Buffer.from(raw, 'hex');
  else key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('DATA_ENCRYPTION_KEY harus 32 byte (base64) atau 64 karakter hex');
  return key;
}

// AES-256-GCM is for data that must be reversibly encrypted; passwords remain bcrypt hashes.
export function encryptSensitive(plaintext) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString('base64url')).join('.');
}

export function decryptSensitive(payload) {
  const parts = String(payload).split('.');
  if (parts.length !== 3) throw new Error('Payload AES-256 tidak valid');
  const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, 'base64url'));
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

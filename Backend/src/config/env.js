import 'dotenv/config';

const origins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: Number.parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigins: origins,
  cookieName: process.env.COOKIE_NAME || 'rs_queue_token',
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY || ''
});

export function assertRuntimeConfig() {
  const missing = [];
  if (!env.databaseUrl) missing.push('DATABASE_URL');
  if (!env.jwtSecret || env.jwtSecret.length < 32) missing.push('JWT_SECRET (minimal 32 karakter)');
  if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) missing.push('PORT (1-65535)');
  if (missing.length) throw new Error(`Konfigurasi belum valid: ${missing.join(', ')}`);
}

import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { env } from '../src/config/env.js';

if (process.env.CONFIRM_DB_OBJECTS !== 'true') {
  console.error('Dibatalkan. Tinjau database/objects.sql dan jalankan dengan CONFIRM_DB_OBJECTS=true setelah memastikan DATABASE_URL menunjuk ke database yang benar.');
  process.exit(1);
}

let url;
try { url = new URL(env.databaseUrl); }
catch { console.error('DATABASE_URL tidak valid.'); process.exit(1); }
if (!['mysql:', 'mariadb:'].includes(url.protocol)) {
  console.error('Script ini hanya mendukung DATABASE_URL MySQL/MariaDB.');
  process.exit(1);
}

const host = url.hostname || '127.0.0.1';
const port = url.port || '3306';
const username = decodeURIComponent(url.username);
const password = decodeURIComponent(url.password);
const database = decodeURIComponent(url.pathname.replace(/^\//, ''));
if (!database) { console.error('Nama database tidak ditemukan di DATABASE_URL.'); process.exit(1); }
const sql = await readFile(new URL('../database/objects.sql', import.meta.url), 'utf8');
const result = spawnSync('mysql', ['--protocol=TCP', '--host', host, '--port', port, '--user', username, '--database', database], {
  input: sql,
  encoding: 'utf8',
  env: { ...process.env, MYSQL_PWD: password },
  maxBuffer: 10 * 1024 * 1024
});
if (result.error) {
  console.error(`Gagal menjalankan mysql CLI: ${result.error.message}`);
  console.error('Pastikan MySQL client tersedia di PATH atau jalankan database/objects.sql melalui MySQL Workbench.');
  process.exit(1);
}
if (result.status !== 0) {
  console.error(result.stderr || 'SQL object application failed.');
  process.exit(result.status || 1);
}
console.log('View, stored procedure, trigger, dan event berhasil diterapkan. Pastikan EVENT_SCHEDULER=ON untuk penjadwalan otomatis.');
if (result.stdout) console.log(result.stdout);

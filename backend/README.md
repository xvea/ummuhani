# RS Ummu Hani — Queue Backend v2

Backend Node.js + JavaScript untuk Sistem Antrian RS Ummu Hani Purbalingga, direvisi mengikuti backlog detail US-001 sampai US-043.

## Stack (dipertahankan)

- Node.js 18+ / JavaScript ES Modules
- pnpm, Express.js 5, Prisma ORM, MySQL 8.x
- Socket.io, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`

## 1. Instalasi lokal

```bash
pnpm install
cp .env.example .env
```

Isi `.env`: `DATABASE_URL` untuk database development dan `JWT_SECRET` acak minimal 32 karakter. Default port backend adalah `3001` dan masa JWT `8h`.

## 2. Database — baca sebelum menjalankan

**Jangan jalankan migrasi terhadap database SIMRS produksi sebelum schema dikonfirmasi pihak rumah sakit.** Skema Prisma dalam repo ini adalah baseline implementasi backlog dan menggunakan composite unique `(tiketreg, tanggalberobat)` agar tiket harian bisa berulang tanpa menghapus histori.

Untuk database development kosong yang dikelola tim:

```bash
pnpm prisma:validate
pnpm prisma:migrate
pnpm prisma:generate
pnpm db:seed
```

Akun admin hanya dibuat oleh seed jika kredensial seed aman telah diisi di `.env`; atau buat manual:

```bash
pnpm admin:create admin 'PasswordAman123!' 'Administrator'
```

Untuk database SIMRS existing yang schema-nya belum dikonfirmasi, gunakan `pnpm prisma:pull` ke database yang disetujui, tinjau perubahan schema, lalu sesuaikan service dan database objects. Jangan langsung meng-overwrite schema rumah sakit.

View/trigger/procedure/event:

```bash
# Periksa database target sebelum menerapkan objek SQL.
CONFIRM_DB_OBJECTS=true pnpm db:objects
```

Perintah tersebut memerlukan `mysql` CLI ada di `PATH`. Alternatifnya, jalankan `database/objects.sql` melalui MySQL Workbench. MySQL Event Scheduler harus aktif agar `ev_reset_antrean_harian` dijalankan otomatis. Stored procedure menjaga histori; penomoran dimulai kembali secara logis karena query nomor antrean dibatasi tanggal operasional WIB.

## 3. Jalankan server

```bash
pnpm dev
```

- Health: `GET http://localhost:3001/api/health`
- Database readiness: `GET http://localhost:3001/api/health/ready`
- API dokumentasi: `docs/ENDPOINTS.md`
- Postman: `postman/RS-Ummu-Hani-Backend.postman_collection.json`
- Event realtime: `docs/SOCKET.md`
- Status subtask backlog: `docs/BACKLOG-COVERAGE.md` (ringkasan per US) dan `docs/SUBTASK-STATUS.md` (128 subtask individual)

## 4. Alur antrean sesuai backlog detail

1. Kiosk memanggil `GET /api/poli` lalu `POST /api/antrian`.
2. Panel loket login, lalu `GET /api/antrian` hanya menampilkan poli yang ditugaskan kepada petugas.
3. Panggil via `POST /api/antrian/panggil`; backend broadcast `actionType=call` dan `queue:tts`.
4. Recall via `POST /api/antrian/:tiketreg/panggil-ulang`; skip via `/lewati`; finish via `/selesai`.
5. Display mengambil initial state dari `GET /api/antrian/display`, lalu mendengar `queue:update`, `queue:tts`, dan `poli:update`.
6. Admin memakai `/api/admin/poli`, `/api/admin/users`, dan `/api/admin/rekap`.

Status antrean API mengikuti backlog detail: `waiting`, `called`, `skipped`, `done`. Tombol Selesai hanya valid saat state `called`, sesuai US-022.

## 5. Password dan enkripsi

Password hanya disimpan sebagai hash bcrypt. Utilitas `src/utils/crypto.js` menggunakan AES-256-GCM untuk data yang memang memerlukan enkripsi reversibel; isi `DATA_ENCRYPTION_KEY` menggunakan 32 byte base64 atau 64 karakter hex. Jangan menggunakan AES untuk menyimpan password.

HTTPS/WSS di server produksi berada di belakang Nginx. `deploy/nginx/rs-queue.conf` dan `deploy/generate-local-cert.sh` adalah contoh awal yang harus disesuaikan/diuji pada jaringan RS dan dipercaya pada tiap perangkat klien.

## 6. Pengujian

```bash
pnpm test
pnpm test:syntax
```

Tes otomatis dalam repo memeriksa fungsi utilitas dan aturan status. Pengujian API end-to-end/Postman tetap harus dijalankan setelah database beserta view/trigger/procedure disiapkan. Performance <5 detik dan UAT di lingkungan RS belum dibuktikan oleh source code saja.

## 7. Scope

ZIP ini adalah **backend**. Halaman Next.js, Web Speech API/audio queue, printer fisik, browser kiosk, konfigurasi server RS, latency browser end-to-end, dan UAT pengguna perlu diselesaikan/dibuktikan di lingkungan terkait. Untuk status yang lebih rinci per US dan subtask, lihat `docs/BACKLOG-COVERAGE.md`.

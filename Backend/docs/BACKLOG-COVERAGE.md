# Pemetaan Backlog US-001 s.d. US-043 — Backend v2

Dokumen ini memetakan implementasi kode di ZIP ini ke backlog detail dua bagian. Status ini **bukan** hasil UAT di rumah sakit. Tanpa koneksi ke instance MySQL development dan perangkat frontend/kiosk/display yang nyata, migrasi, trigger, stored procedure, Socket.io lintas aplikasi, latency, dan UAT belum bisa dinyatakan lulus runtime.

## Arti status

- **CLEAR (kode)**: subtask backend/database sudah diimplementasikan di source/konfigurasi dalam ZIP.
- **PARTIAL / perlu verifikasi**: implementasi tersedia, tetapi bergantung pada MySQL/konfigurasi/server, atau acceptance test belum dijalankan.
- **DI LUAR BACKEND**: subtask frontend/perangkat/operasional pengguna; ZIP backend tidak dapat menyelesaikannya sendirian.
- **BELUM CLEAR**: pekerjaan pengujian lapangan atau bukti kinerja belum dilakukan.

## Ringkasan per User Story

| US | Status backend | Ringkasan |
|---|---|---|
| US-001 | DI LUAR BACKEND | Setup/routing/layout Next.js, tidak termasuk paket backend |
| US-002 | CLEAR (kode) | Express MVC, controller/service/route/middleware, `/api/health`, port default 3001 |
| US-003 | PARTIAL / perlu DB | Enam model utama, relasi, Prisma scripts dan seeder tersedia; migrasi belum dijalankan terhadap DB nyata |
| US-004 | CLEAR (server) / DI LUAR BACKEND (client) | SocketManager, room, `broadcastUpdate()` dan `emitTTS()`; hook dan `socket.io-client` frontend belum dibuat di ZIP ini |
| US-005 | CLEAR (kode) | bcrypt, JWT 8 jam, utilitas hash/compare/token dan middleware Bearer/cookie |
| US-006 | PARTIAL / deployment | Utilitas AES-256-GCM dan contoh Nginx/sertifikat tersedia; belum diinstal/dipercaya pada jaringan RS |
| US-007 | CLEAR (BE) | Login dan token aktif di `User.token`; UI/login redirect di luar backend |
| US-008 | CLEAR (BE) | Role `admin`/`petugas` masuk dalam respons login; redirect/proteksi Next.js di luar backend |
| US-009 | CLEAR (BE) | Signature JWT + pencocokan `User.token`; semua route operasional/admin diproteksi sesuai role |
| US-010 | CLEAR (BE) | Logout membuat `User.token = NULL`; tombol/clear storage frontend di luar backend |
| US-011 | CLEAR (BE) | `GET /api/poli`; UI dan listener kiosk di luar backend |
| US-012 | CLEAR (BE) | Queue create menolak poli tutup dan mengembalikan 409 |
| US-013 | CLEAR (kode) | Nomor per hari/poli, simpan Pendaftaran + `task1`, broadcast event; printer/tiket fisik di luar backend |
| US-014 | DI LUAR BACKEND | Modal pesan poli tutup dan auto-close adalah UI kiosk |
| US-015 | CLEAR (BE) | Endpoint initial state `/api/antrian/display`; UI/Socket listener frontend belum termasuk |
| US-016 | PARTIAL | Endpoint log error audio tersedia; Web Speech API, serial audio queue, device readiness tetap pekerjaan frontend/perangkat |
| US-017 | CLEAR (BE) | Event Socket.io membawa `actionType`; `call`/`recall` memancarkan `queue:tts` |
| US-018 | CLEAR (BE) | `GET /api/antrian` membatasi daftar berdasarkan `User.poli` dan mendukung filter |
| US-019 | CLEAR (kode) | Call antrean waiting terdepan, status `called`, broadcast + TTS |
| US-020 | CLEAR (kode) | Recall hanya untuk `called`, memancarkan `queue:tts` tanpa mengubah state |
| US-021 | CLEAR (kode) | Skip hanya dari `called` ke `skipped`, broadcast tanpa TTS |
| US-022 | CLEAR (kode) | Finish hanya dari `called` ke `done`; salah state menghasilkan HTTP 400 |
| US-023 | CLEAR (BE) | `GET /api/admin/poli` termasuk jumlah antrean tanggal ini |
| US-024 | CLEAR (kode) | Create poli dengan validasi dan unique constraint dari primary key |
| US-025 | CLEAR (kode) | Update nama/deskripsi dan validasi panjang field |
| US-026 | CLEAR (kode) | Hapus poli ditolak jika histori pendaftaran masih ada |
| US-027 | CLEAR (kode) | Toggle `aktifonline` memancarkan `poli:update` dan `poli:status` |
| US-028 | CLEAR (BE) | `GET /api/admin/users` hanya mengembalikan petugas tanpa password hash |
| US-029 | CLEAR (kode) | Create akun petugas, role otomatis `petugas`, bcrypt, validasi poli |
| US-030 | CLEAR (kode) | Update nama, poli, dan password opsional; perubahan password revoke sesi lama |
| US-031 | CLEAR (kode) | Hapus petugas dengan perlindungan penghapusan akun yang sedang dipakai |
| US-032 | CLEAR (BE) | JWT/response user berisi `poli`; daftar antrean petugas otomatis dibatasi assignment |
| US-033 | PARTIAL / perlu DB | `/api/admin/rekap` default hari ini, bergantung view `vw_rekap_antrian_harian` yang harus diaplikasikan |
| US-034 | CLEAR (kode) | Filter `?tanggal=YYYY-MM-DD`, tanggal divalidasi |
| US-035 | CLEAR (kode) | Filter `?poli=KODE_POLI`, dapat digabung dengan tanggal |
| US-036 | PARTIAL / perlu DB | DDL view + TIMESTAMPDIFF dan label durasi tersedia; belum diverifikasi terhadap schema/dataset SIMRS |
| US-037 | PARTIAL / perlu DB/QA | Procedure dan event harian ada. Penomoran di backend reset secara logis berdasarkan tanggal sambil menjaga histori; `CALL` dan Event Scheduler belum diuji pada MySQL target |
| US-038 | PARTIAL / perlu DB/QA | Trigger status→timestamp tersedia; perlu dipasang dan diverifikasi pada MySQL target |
| US-039 | BELUM CLEAR | Belum ada hasil pengukuran latency multi-client/browser; jangan tandai lulus hanya dari source code |
| US-040 | PARTIAL | Postman collection dan kontrak Socket.io tersedia; eksekusi API test belum dilakukan karena butuh DB yang disiapkan |
| US-041 | PARTIAL / Ops | Contoh Nginx, generator sertifikat dan dokumentasi setup tersedia; server Ubuntu/PM2/firewall produksi belum dikonfigurasi |
| US-042 | PARTIAL / Ops | Skrip startup Chromium kiosk/display tersedia; uji layar sentuh dan speaker belum dilakukan |
| US-043 | BELUM CLEAR | UAT bersama petugas/perwakilan RS belum dilakukan |

## Detail subtask backend/database dan statusnya

### US-002 — Setup Express.js + Node.js

- **CLEAR** — Inisialisasi Node.js dan dependency Express/CORS/Dotenv dalam `package.json`.
- **CLEAR** — Struktur `routes/`, `controllers/`, `services/`, `middlewares/`, `utils/` tersedia.
- **CLEAR** — Modul `AuthController`, `AdminController`, `AntrianController` tersedia sebagai controllers/routes/services modular; `SocketManager` tersedia dalam `src/sockets/index.js`.
- **CLEAR** — `GET /api/health` tersedia; default `PORT=3001`.

### US-003 — Database MySQL + Prisma

- **CLEAR** — `prisma` dan `@prisma/client` tercantum sebagai dependency.
- **CLEAR (baseline)** — Model `User`, `Poli`, `Pasien`, `Dokter`, `Pendaftaran`, `TaskAntrian` tersedia di `prisma/schema.prisma`.
- **CLEAR (baseline)** — Relasi Pendaftaran→Pasien/Poli/Dokter dan Task_Antrian→Pendaftaran didefinisikan.
- **PARTIAL** — `pnpm prisma:migrate`, `pnpm prisma:generate`, `pnpm db:seed`, dan `pnpm admin:create` tersedia; migrasi/seed belum dijalankan terhadap instance MySQL dari sini. Untuk DB SIMRS, jalankan `pnpm prisma:pull` pada lingkungan yang disetujui dan tinjau hasilnya sebelum perubahan.

### US-004 — Socket.io

- **CLEAR (backend)** — `socket.io` diinstal sebagai dependency.
- **CLEAR** — SocketManager mempunyai `broadcastUpdate()` dan `emitTTS()`.
- **CLEAR** — Room per poli (`poli:KODE`) dan room global/display/kiosk diimplementasikan.
- **DI LUAR BACKEND** — Instalasi `socket.io-client`, hook/provider dan auto-reconnect Next.js perlu dibuat di repo frontend.

### US-005 — JWT dan Bcrypt

- **CLEAR** — `src/utils/password.js` menyediakan `hashPassword()` dan `comparePassword()` menggunakan bcrypt.
- **CLEAR** — `src/utils/jwt.js` menyediakan `generateToken()` dan `verifyToken()`; default `JWT_EXPIRES_IN=8h`.
- **CLEAR** — JWT membawa `login`, `grupuser`, dan `poli`; token aktif disimpan ke `User.token`.
- **CLEAR** — `authenticate` membaca Bearer token atau cookie, memverifikasi signature/expiry, dan mencocokkan token aktif DB.

### US-006 — HTTPS dan AES-256

- **PARTIAL (Ops)** — `deploy/generate-local-cert.sh` disediakan; sertifikat belum dibuat/dipasang pada server yang sebenarnya dan harus dipercaya di perangkat klien.
- **PARTIAL (Ops)** — `deploy/nginx/rs-queue.conf` menyediakan port 80→443, proxy HTTP/Socket.io ke port 3001, dan konfigurasi TLS; belum diuji di Nginx produksi.
- **PARTIAL (Ops)** — Redirect HTTP→HTTPS ada pada contoh Nginx, tetapi belum runtime-tested.
- **CLEAR (kode)** — `src/utils/crypto.js` menyediakan AES-256-GCM untuk data yang perlu dibalikkan enkripsinya. Password tetap di-hash dengan bcrypt, bukan AES.

### US-007 sampai US-010 — Authentication

- **US-007 — CLEAR (BE)** — `POST /api/auth/login` validasi kredensial dan membentuk JWT; token aktif disimpan pada `User.token`.
- **US-008 — CLEAR (BE)** — Respons login mencantumkan `grupuser` dan `poli`, sehingga frontend dapat melakukan role redirect. Redirect UI/proteksi Next.js belum termasuk.
- **US-009 — CLEAR (BE)** — Middleware dipasang pada route admin, user management, rekap, dan operasi petugas. Token expired/tidak aktif menghasilkan 401; role salah menghasilkan 403.
- **US-010 — CLEAR (BE)** — `POST /api/auth/logout` mengosongkan token DB. Pembersihan token browser dan tombol logout merupakan tugas FE.

### US-011 sampai US-022 — Kiosk, Display, Loket

- **US-011 — CLEAR (BE)** — `GET /api/poli` mengambil seluruh poli dan menerima filter `?open=true`.
- **US-012 — CLEAR (BE)** — `POST /api/antrian` memeriksa `aktifonline`; poli tutup ditolak dengan 409 dan kode `POLI_CLOSED`.
- **US-013 — CLEAR (kode)** — Nomor `noantripoli` naik per poli/tanggal WIB; Pendaftaran dibuat dengan status `waiting`; `Task_Antrian.task1` dibuat; broadcast `actionType=create` dikirim. Cetak printer fisik/`window.print()` belum termasuk backend.
- **US-014 — DI LUAR BACKEND** — UI dialog/timer merupakan FE.
- **US-015 — CLEAR (BE)** — `GET /api/antrian/display` memberikan data initial current queue dan total antrean waiting per poli. UI Display serta listener klien belum termasuk.
- **US-016 — PARTIAL** — `POST /api/logs/audio-error` menerima dan mencatat log error audio. Kesiapan perangkat, serialisasi audio, TTS `id-ID`, toast dan pengiriman dari FE belum dibuat dalam repo backend.
- **US-017 — CLEAR (BE)** — Payload `queue:update` menyertakan `actionType`; action `call` dan `recall` juga menghasilkan event `queue:tts`; `skip`/`done` tidak menghasilkan TTS.
- **US-018 — CLEAR (BE)** — `GET /api/antrian` hanya mengembalikan poli yang ditugaskan pada petugas jika tidak ada filter; pemaksaan poli yang bukan assignment menghasilkan 403.
- **US-019 — CLEAR (kode)** — `POST /api/antrian/panggil` mengambil antrean `waiting` terdepan, mengubahnya menjadi `called`, broadcast dan TTS. Tidak ada antrean menghasilkan 404 dengan `QUEUE_EMPTY`.
- **US-020 — CLEAR (kode)** — `POST /api/antrian/:tiketreg/panggil-ulang` hanya menerima state `called` dan memancarkan event TTS tanpa mengubah state.
- **US-021 — CLEAR (kode)** — `POST /api/antrian/:tiketreg/lewati` mengubah `called`→`skipped`, broadcast update tanpa TTS.
- **US-022 — CLEAR (kode)** — `POST /api/antrian/:tiketreg/selesai` mensyaratkan `called`; invalid state menghasilkan HTTP 400 dengan pesan `Antrian belum dipanggil / tidak sedang dilayani`; sukses mengubah ke `done` dan broadcast.

### US-023 sampai US-032 — Manajemen Poli dan Petugas

- **US-023 — CLEAR (BE)** — `GET /api/admin/poli` menambahkan `jumlah_antrian_hari_ini` per poli.
- **US-024 — CLEAR** — `POST /api/admin/poli` memvalidasi `kode_poli`, `poli`, batas panjang dan uniqueness DB.
- **US-025 — CLEAR** — `PUT /api/admin/poli/:kode_poli` validasi dan memperbarui `poli`/`deskripsi` serta menerima `aktifonline` opsional.
- **US-026 — CLEAR** — `DELETE /api/admin/poli/:kode_poli` menolak poli yang masih direferensikan histori Pendaftaran.
- **US-027 — CLEAR** — `PATCH /api/admin/poli/:kode_poli/status` mengubah `aktifonline` dan mengirim event `poli:update` serta `poli:status`.
- **US-028 — CLEAR (BE)** — `GET /api/admin/users` mengambil role `petugas` dan tidak memilih kolom password/token.
- **US-029 — CLEAR** — `POST /api/admin/users` membuat role `petugas`, bcrypt hash password, validasi username/nama/poli.
- **US-030 — CLEAR** — `PUT /api/admin/users/:login` mengubah `namalengkap`/`poli` dan re-hash password hanya jika dikirim; perubahan password mencabut token lama.
- **US-031 — CLEAR** — `DELETE /api/admin/users/:login` hanya menghapus user `petugas` dan menolak jika target sama dengan login actor.
- **US-032 — CLEAR (BE)** — Data login/JWT memuat `poli` dan query antrean petugas dibatasi oleh assignment ini.
- **Catatan FE** — form, dropdown, konfirmasi hapus, alert/toast dan tampilan dashboard tidak termasuk ZIP backend.

### US-033 sampai US-038 — Rekap dan database objects

- **US-033 — PARTIAL / perlu DB** — `GET /api/admin/rekap` default ke tanggal operasional hari ini, query ke `vw_rekap_antrian_harian` dan memberikan ringkasan. Endpoint siap; view harus diaplikasikan terlebih dahulu.
- **US-034 — CLEAR (kode)** — `?tanggal=YYYY-MM-DD` divalidasi dan dapat dipakai memilih tanggal.
- **US-035 — CLEAR (kode)** — `?poli=KODE_POLI` bisa dikombinasikan dengan `tanggal`.
- **US-036 — PARTIAL / perlu DB** — `database/objects.sql` membuat view dengan join dan `TIMESTAMPDIFF`; service menambahkan label durasi. Hasil aktual perlu diuji terhadap data riil/struktur tabel yang telah dikonfirmasi.
- **US-037 — PARTIAL / perlu DB/QA** — `database/objects.sql` membuat procedure dan event harian. Nomor di aplikasi dihitung dengan tanggal operasional, sehingga histori tidak dihapus untuk reset; procedure mengembalikan nomor berikutnya per poli agar dapat diverifikasi. `CALL sp_reset_antrean_harian()` dan Event Scheduler belum dijalankan dari sini. Pastikan `event_scheduler=ON` di MySQL target.
- **US-038 — PARTIAL / perlu DB/QA** — Trigger `trg_log_status_pendaftaran` dan helper `TaskAntrian.catatTask()` mencatat task2/3/4/5 untuk status `verified`/`Diverifikasi`, `called`/`Dipanggil`, `serving`/`Sedang Dilayani`, `done`/`Selesai`. Perlu dipasang dan dites pada DB target; alur default backlog `waiting→called→done` secara alami menggunakan task1/task3/task5.

### US-039 sampai US-043 — QA, dokumentasi, dan operasional

- **US-039 — BELUM CLEAR** — Belum ada hasil pengukuran latency <5 detik dari loket sampai render Display. Angka target tidak boleh dinyatakan tercapai tanpa menjalankan skenario multi-client di FE/lingkungan uji.
- **US-040 — PARTIAL** — `postman/RS-Ummu-Hani-Backend.postman_collection.json` berisi alur request positif/negatif; `docs/SOCKET.md` mendokumentasikan event/payload. Collection belum dijalankan penuh terhadap MySQL nyata, jadi automated/manual API test belum dapat ditandai lulus.
- **US-041 — PARTIAL / Ops** — Contoh Nginx/sertifikat dan instruksi tersedia; Node/MySQL/Nginx/PM2/firewall belum dikonfigurasi pada server RS.
- **US-042 — PARTIAL / Ops** — `deploy/kiosk/start-kiosk.sh` dan `deploy/kiosk/start-display.sh` tersedia; belum diuji pada perangkat Kiosk/Display yang sesungguhnya.
- **US-043 — BELUM CLEAR** — Belum dilakukan UAT FR-01 s.d. FR-08 bersama perwakilan RS; hasil/berita acara harus dilengkapi tim dan pihak RS.

## Verifikasi yang perlu dilakukan setelah ZIP dibuka

1. Siapkan database **development**, isi `.env`, dan jalankan `pnpm install` serta `pnpm prisma:validate`.
2. Untuk database kosong yang dikelola tim: `pnpm prisma:migrate`, lalu `pnpm prisma:generate`. Untuk database SIMRS yang sudah ada: jangan migrate dulu; `pnpm prisma:pull` dan cocokkan schema lebih dahulu.
3. Terapkan `database/objects.sql` lewat MySQL Workbench atau `CONFIRM_DB_OBJECTS=true pnpm db:objects`; pastikan EVENT Scheduler aktif.
4. Buat admin (`pnpm admin:create admin 'PasswordAman123!' 'Administrator'`) dan jalankan `pnpm dev`.
5. Import Postman collection/environment, sesuaikan `baseUrl`, username/password admin, tanggal, dan kode poli. Jalankan rangkaian test; dokumentasikan request gagal atau beda schema sebelum menyatakan US lulus.

# Endpoint REST Backend

Base URL lokal: `http://localhost:3001`. Endpoint berhasil menggunakan envelope `{ "success": true, "data": ... }`; error menggunakan `{ "success": false, "message": ..., "details"?: ... }`.

| Method | Path | Auth | Ringkasan |
|---|---|---|---|
| GET | `/api/health` | Publik | Health check US-002 |
| GET | `/api/health/ready` | Publik | Health check dan ping database |
| POST | `/api/auth/login` | Publik | Login, JWT disimpan di `User.token` |
| GET | `/api/auth/me` | Bearer/session | Informasi akun aktif |
| POST | `/api/auth/logout` | Bearer/session | Menghapus token aktif di DB |
| GET | `/api/poli` | Publik | List poli, opsional `?open=true` |
| GET | `/api/poli/:kode_poli` | Publik | Detail poli |
| GET | `/api/admin/poli` | Admin | List poli + jumlah antrean hari ini |
| POST | `/api/admin/poli` | Admin | Tambah poli |
| PUT | `/api/admin/poli/:kode_poli` | Admin | Ubah nama/deskripsi/status opsional |
| PATCH | `/api/admin/poli/:kode_poli/status` | Admin | Buka/tutup poli; body `{ "aktifonline": 0|1 }` |
| DELETE | `/api/admin/poli/:kode_poli` | Admin | Hapus poli jika tidak ada histori pendaftaran |
| GET | `/api/admin/users` | Admin | Daftar petugas tanpa hash password |
| POST | `/api/admin/users` | Admin | Buat akun petugas; body `login`, `password`, `namalengkap`, opsional `poli` |
| PUT | `/api/admin/users/:login` | Admin | Ubah nama, poli, atau password (opsional) |
| DELETE | `/api/admin/users/:login` | Admin | Hapus akun petugas; tidak dapat menghapus akun aktif sendiri |
| POST | `/api/antrian` | Publik/Kiosk | Ambil nomor; body minimal `{ "poli": "UMUM" }`; `norm`, `dokter`, `jenisantrian`, `jamdatang` opsional |
| GET | `/api/antrian` | Petugas | Daftar antrean hari ini; filter `?tanggal=YYYY-MM-DD&poli=UMUM&status=waiting` |
| POST | `/api/antrian/panggil` | Petugas | Body `{ "poli": "UMUM" }`; memanggil nomor waiting terdepan |
| POST | `/api/antrian/:tiketreg/panggil-ulang` | Petugas | Recall status called, emit TTS |
| POST | `/api/antrian/:tiketreg/lewati` | Petugas | Ubah called menjadi skipped tanpa TTS |
| POST | `/api/antrian/:tiketreg/selesai` | Petugas | Ubah called menjadi done; 400 jika belum called |
| GET | `/api/antrian/display` | Publik/Display | Data awal current queue dan jumlah menunggu per poli |
| GET | `/api/pasien/:norm` | Publik | Lookup Pasien lokal (bila data SIMRS tersedia pada database yang dipetakan) |
| GET | `/api/admin/rekap` | Admin | View harian, default tanggal hari ini |
| GET | `/api/admin/rekap?tanggal=YYYY-MM-DD&poli=UMUM` | Admin | Rekap filter tanggal dan/atau poli (tanpa spasi setelah `?`) |
| POST | `/api/logs/audio-error` | Publik/Display | Menerima log error perangkat audio tanpa data pasien |

Alias kompatibilitas versi sebelumnya tetap ada pada `/health`, `/api/patients/:norm`, serta `/api/auth/staff`; integrasi baru sebaiknya menggunakan endpoint canonical di atas.

## HTTP status penting

- `400`: validasi input atau aksi tidak sesuai state (termasuk menyelesaikan antrean belum dipanggil).
- `401`: token tidak ada, invalid, expired, atau sesi sudah dicabut.
- `403`: role/poli tidak berhak.
- `404`: data/antrean tidak ditemukan, atau antrean waiting habis (`details.code = QUEUE_EMPTY`).
- `409`: poli tutup, duplikasi, histori membuat poli tidak bisa dihapus, atau konflik concurrent update.
- `422`: tidak digunakan sebagai status validasi utama; validasi request canonical memakai `400` untuk konsisten dengan US-022.

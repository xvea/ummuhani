# Arsitektur Backend

## Stack

- Node.js 18+ dan JavaScript ES Modules
- Express.js 5, Prisma ORM, MySQL 8.x
- Socket.io server untuk event realtime
- `jsonwebtoken` untuk JWT, `bcrypt` untuk password hashing
- `dotenv` dan `cors`

## Pembagian lapisan

- `src/routes`: deklarasi endpoint dan middleware per role
- `src/controllers`: mapping request/response HTTP
- `src/services`: logika bisnis, validasi status, dan query Prisma
- `src/middlewares`: autentikasi, otorisasi, validasi request, error handler
- `src/sockets`: `SocketManager` untuk room, broadcast status, dan event TTS
- `src/utils`: JWT, bcrypt helper, tanggal WIB, aturan antrean, AES-256-GCM
- `database/objects.sql`: view rekap, stored procedure, trigger, dan event MySQL

## State antrean mengikuti backlog detail

| Status | Makna | Aksi berikutnya |
|---|---|---|
| `waiting` | Menunggu dipanggil | `called` via `POST /api/antrian/panggil` |
| `called` | Dipanggil/menunggu pelayanan | `called` via recall, `skipped` via lewati, atau `done` via selesai |
| `skipped` | Dilewati | Terminal pada alur operator saat ini |
| `done` | Selesai | Terminal |

Backlog detail US-022 meminta penyelesaian dari status `called`; karena itu backend baru tidak mewajibkan status `serving` yang ada pada versi lama.

## Nomor antrean harian

Nomor urut dihitung dari `MAX(noantripoli)` untuk kombinasi tanggal operasional WIB dan kode poli. Skema menggunakan unique gabungan `(tiketreg, tanggalberobat)`, sehingga `UMUM-01` dapat digunakan kembali pada hari berikutnya tanpa menghapus data histori. `Task_Antrian` menggunakan primary key gabungan `(kodebooking, tanggal)` agar relasi ke histori tetap spesifik per tanggal.

> **Penting untuk SIMRS:** struktur kolom di sini adalah baseline development dari backlog/SDD. Sebelum integrasi ke database RS, lakukan `prisma db pull` pada database yang disetujui, bandingkan hasilnya, lalu sesuaikan `schema.prisma`, trigger, dan view. Jangan menjalankan `prisma migrate dev` terhadap database SIMRS produksi.

## Keamanan

- JWT 8 jam dan disimpan pada `User.token`; middleware memeriksa signature dan token aktif di database.
- Password disimpan sebagai hash bcrypt; password **tidak** dienkripsi dengan AES.
- AES-256-GCM tersedia melalui utilitas `src/utils/crypto.js` untuk data/payload yang perlu dienkripsi secara reversibel.
- HTTPS/WSS disediakan oleh reverse proxy Nginx, bukan oleh server Express development.

# Checklist Deployment (US-006, US-041, US-042)

Ini panduan awal; belum merupakan bukti bahwa server produksi telah disiapkan.

1. Siapkan Ubuntu Server yang disetujui tim RS; batasi akses SSH kepada admin.
2. Pasang Node.js 18 LTS atau lebih baru, pnpm, MySQL 8.x bila DB dikelola pada server ini, Nginx, OpenSSL, dan PM2.
3. Pastikan database user aplikasi memiliki privilege minimum; port 3306 hanya dapat diakses oleh host aplikasi/database yang diperlukan.
4. Salin `.env` dari template dan isi `DATABASE_URL`, `JWT_SECRET` kuat, `JWT_EXPIRES_IN=8h`, `CLIENT_URL`, dan `DATA_ENCRYPTION_KEY` bila utilitas AES dipakai.
5. Validasi skema terhadap database rumah sakit sebelum migrasi atau menjalankan `database/objects.sql`.
6. Buat sertifikat untuk IP/hostname yang dipakai. Contoh self-signed tersedia pada `deploy/generate-local-cert.sh`; pasang trust CA/certificate pada tiap perangkat klien atau gunakan sertifikat internal yang disetujui RS.
7. Sesuaikan `deploy/nginx/rs-queue.conf`, uji `nginx -t`, lalu reload Nginx. Port 80 diarahkan ke 443; backend mendengar pada 127.0.0.1:3001.
8. Jalankan `pnpm install --prod` setelah dependencies/generated Prisma client siap, lalu `pm2 start deploy/pm2/ecosystem.config.cjs --env production`, `pm2 save`, dan `pm2 startup` sesuai instruksi PM2 pada server tersebut.
9. Firewall LAN: publikasikan port 80/443 seperlunya dan jangan publikasikan port 3306 ke jaringan umum.
10. Jalankan readiness check, koleksi Postman, Socket.io multi-client, browser kiosk/display, uji audio/TTS, load testing dan UAT sebelum dinyatakan siap operasi.

## Startup browser

Atur `SERVER_URL` dan `BROWSER`, lalu jalankan `deploy/kiosk/start-kiosk.sh` di perangkat Kiosk dan `deploy/kiosk/start-display.sh` di perangkat Display. Uji touchscreen serta keluaran speaker secara fisik.

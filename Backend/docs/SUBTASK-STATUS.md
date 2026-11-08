# Audit Subtask Backlog — Backend v2

Sumber task: dua file Product Backlog Scrum Detail US-001–022 dan US-023–043 yang diberikan. Status di bawah menilai apakah subtask tersebut sudah didukung oleh artefak backend v2; status ini bukan hasil UAT. Teks task dipertahankan sedekat mungkin dengan backlog. Subtask FE/Ops/QA tetap dinilai sesuai ruang lingkupnya, tidak otomatis dianggap selesai oleh adanya endpoint.

## Ringkasan status subtask

- `CLEAR (kode)`: 46 subtask
- `CLEAR (schema baseline)`: 3 subtask
- `CLEAR (dokumentasi tersedia)`: 1 subtask
- `CLEAR (artifact Postman tersedia; eksekusi test belum dilakukan)`: 1 subtask
- `CLEAR (script tersedia; belum diuji di perangkat)`: 2 subtask
- `PARTIAL (kode/SQL tersedia; perlu verifikasi DB/runtime)`: 1 subtask
- `PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)`: 6 subtask
- `PARTIAL (migrasi/seed belum dijalankan pada MySQL)`: 1 subtask
- `PARTIAL (endpoint pencatatan error audio tersedia; integrasi perangkat/frontend belum ada)`: 2 subtask
- `PARTIAL (server dependency clear; socket.io-client frontend di luar backend)`: 1 subtask
- `PARTIAL (deployment/ops belum diuji di server RS)`: 3 subtask
- `PARTIAL (konfigurasi PM2 contoh tersedia; belum dijalankan di server)`: 1 subtask
- `DI LUAR BACKEND`: 46 subtask
- `BELUM DILAKUKAN (butuh hasil pengujian nyata)`: 10 subtask
- `BELUM DILAKUKAN (butuh lingkungan/perangkat sebenarnya)`: 4 subtask

## Daftar subtask per User Story

### US-001 — Setup Next.js 16 Project (Frontend)
- **DI LUAR BACKEND** — Inisialisasi proyek Next.js 16 dengan TypeScript dan Tailwind CSS v4
- **DI LUAR BACKEND** — Buat struktur folder *App Router* untuk `/kiosk`, `/display`, `/dashboard/antrian` (`/loket`), dan `/dashboard` (`/admin`)
- **DI LUAR BACKEND** — Konfigurasi *environment variables* (`NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_SOCKET_URL`)
- **DI LUAR BACKEND** — Buat komponen *layout* dasar sesuai standar resolusi layar Kiosk ($1024 \times 768$) dan Desktop/TV ($1920 \times 1080$)

### US-002 — Setup Express.js + Node.js Project (Backend)
- **CLEAR (kode)** — Inisialisasi proyek Node.js dan instalasi Express.js, CORS, dan Dotenv
- **CLEAR (kode)** — Susun struktur direktori `routes/`, `controllers/`, `services/`, `middlewares/`, dan `utils/`
- **CLEAR (kode)** — Buat kerangka dasar `AuthController`, `AdminController`, dan `AntrianController` sesuai Class Diagram SDD 5.1
- **CLEAR (kode)** — Buat *endpoint health check* (`GET /api/health`) untuk memastikan server berjalan di port `3001`

### US-003 — Konfigurasi Database MySQL & Prisma Schema
- **CLEAR (schema baseline)** — Instalasi Prisma CLI dan `@prisma/client` pada proyek backend
- **CLEAR (schema baseline)** — Definisikan model `User`, `Poli`, `Pasien`, `Dokter`, `Pendaftaran`, dan `Task_Antrian` di `schema.prisma` sesuai tipe data dan panjang kolom SDD Bab 2.2
- **CLEAR (schema baseline)** — Konfigurasi relasi *Foreign Key* pada tabel `Pendaftaran` (ke `Pasien`, `Poli`, `Dokter`) dan `Task_Antrian` (ke `Pendaftaran`)
- **PARTIAL (migrasi/seed belum dijalankan pada MySQL)** — Jalankan migrasi Prisma ke MySQL dan buat *seeder* data awal (akun Admin & sampel data Poli)

### US-004 — Setup Socket.io Server & Client (Real-time)
- **PARTIAL (server dependency clear; socket.io-client frontend di luar backend)** — Instalasi `socket.io` di backend dan `socket.io-client` di frontend Next.js
- **CLEAR (kode)** — Buat kelas/modul `SocketManager` dengan metode `broadcastUpdate()` dan `emitTTS()` sesuai Class Diagram SDD 5.1
- **CLEAR (kode)** — Implementasikan manajemen *room* per poliklinik dan *room* global untuk Kiosk/Display TV
- **DI LUAR BACKEND** — Buat *custom hook* / *context provider* Socket.io di Next.js dengan fitur *auto-reconnect*

### US-005 — Setup Autentikasi JWT & MiddlewareHash Password
- **CLEAR (kode)** — Instalasi pustaka `jsonwebtoken` dan `bcrypt` beserta tipe datanya
- **CLEAR (kode)** — Buat fungsi utilitas `hashPassword` dan `comparePassword` menggunakan `bcrypt`
- **CLEAR (kode)** — Buat fungsi utilitas `generateToken` dan `verifyToken` menggunakan `JWT_SECRET` dan durasi `8h` (SDD 9.2)
- **CLEAR (kode)** — Buat middleware dasar untuk membaca token dari *Header Authorization* / *Cookies*

### US-006 — Setup HTTPS & Enkripsi Keamanan
- **PARTIAL (deployment/ops belum diuji di server RS)** — Buat sertifikat SSL/TLS lokal (*self-signed* / *local CA* untuk jaringan LAN RS) dengan cipher AES-256
- **PARTIAL (deployment/ops belum diuji di server RS)** — Buat konfigurasi Nginx *reverse proxy* untuk meneruskan port 443 (HTTPS & WSS) ke backend port 3001
- **PARTIAL (deployment/ops belum diuji di server RS)** — Konfigurasi *auto-redirect* dari port 80 (HTTP) ke port 443 (HTTPS) sesuai SDD 9.2
- **CLEAR (kode)** — Implementasikan fungsi utilitas enkripsi AES-256 untuk perlindungan payload/data sensitif

### US-007 — Halaman Login untuk Petugas Loket
- **DI LUAR BACKEND** — `[FE]` Buat UI Halaman Login sesuai desain SDD Bab 7 Gambar 1 (input Username, Password, tombol Sign In, dan alert pesan error)
- **CLEAR (kode)** — `[BE]` Implementasikan fungsi `AuthController.login(username, password)` untuk memvalidasi kredensial ke tabel `User`
- **CLEAR (kode)** — `[BE]` Simpan token JWT aktif ke kolom `token` pada tabel `User` saat login berhasil
- **DI LUAR BACKEND** — `[FE]` Integrasikan form login dengan API, simpan token di client, dan arahkan role `petugas` ke halaman Panel Loket

### US-008 — Halaman Login untuk Admin
- **CLEAR (kode)** — `[BE]` Tambahkan pengecekan atribut `grupuser` (`admin` vs `petugas`) pada respons endpoint login
- **DI LUAR BACKEND** — `[FE]` Implementasikan logika *role-based redirect* setelah login berhasil menuju `/dashboard` (`/admin`) untuk role Admin
- **DI LUAR BACKEND** — `[FE]` Buat proteksi rute di sisi klien (Next.js Middleware) agar role `petugas` tidak dapat membuka halaman milik `admin`

### US-009 — Middleware Verifikasi Token/Sesi Aktif
- **CLEAR (kode)** — `[BE]` Implementasikan metode `AuthController.validasiToken(token)` untuk memverifikasi tanda tangan JWT dan mencocokkannya dengan kolom `token` di tabel `User`
- **CLEAR (kode)** — `[BE]` Pasang middleware autentikasi pada seluruh endpoint API operasional loket dan manajemen admin
- **DI LUAR BACKEND** — `[FE]` Buat *interceptor* pada HTTP client (fetch/axios) untuk menangkap respons `401 Unauthorized` dan melakukan *auto-redirect* ke halaman login

### US-010 — Logout & Session Management
- **CLEAR (kode)** — `[BE]` Implementasikan fungsi `AuthController.logout(token)` untuk mengubah nilai kolom `token` menjadi `NULL` di tabel `User`
- **DI LUAR BACKEND** — `[FE]` Tambahkan tombol Logout pada navigasi Panel Loket dan Panel Admin
- **DI LUAR BACKEND** — `[FE]` Hapus token dari `localStorage` / *cookies* saat Logout berhasil dan arahkan ke `/login`

### US-011 — Halaman Utama Kiosk - Daftar Poli Tersedia
- **CLEAR (kode)** — `[BE]` Buat endpoint `GET /api/poli` pada `Controller Poliklinik` untuk mengambil daftar seluruh poliklinik dari tabel `Poli`
- **DI LUAR BACKEND** — `[FE]` Bangun antarmuka halaman `/kiosk` dengan elemen tombol besar ramah layar sentuh (resolusi minimal $1024 \times 768$)
- **DI LUAR BACKEND** — `[FE]` Pasang *listener* Socket.io pada halaman Kiosk untuk menangkap event perubahan status buka/tutup poli secara real-time

### US-012 — Validasi Status Poli Saat Pemilihan
- **CLEAR (kode)** — `[BE]` Buat logika validasi `Query Ketersediaan Poliklinik(poli)` untuk mengecek kolom `aktifonline` pada tabel `Poli` sesuai Sequence Diagram 1
- **DI LUAR BACKEND** — `[FE]` Nonaktifkan atau beri penanda visual jelas pada tombol poli yang berstatus tutup, serta tangani respons validasi dari backend saat tombol ditekan

### US-013 — Generate Nomor Antrian & Cetak Tiket
- **CLEAR (kode)** — `[BE]` Implementasikan `AntrianController.ambilAntrian()` untuk menghitung increment `noantripoli` harian per poli dan membentuk string `tiketreg`
- **CLEAR (kode)** — `[BE]` Simpan transaksi antrian baru ke tabel `Pendaftaran` (`status_pendaftaran = 'waiting'`, `tanggalberobat = CURDATE()`, `jamdatang = NOW()`) dan catat timestamp `task1` ke tabel `Task_Antrian`
- **CLEAR (kode)** — `[BE]` Panggil `SocketManager.broadcastUpdate()` setelah antrian baru tersimpan
- **DI LUAR BACKEND** — `[FE]` Buat tampilan struk/tiket nomor antrian (SDD Bab 7 Gambar 4) dan integrasikan dengan fungsi cetak (`window.print()` / thermal printer kiosk)

### US-014 — Tampilan Pesan Peringatan Poli Tutup
- **DI LUAR BACKEND** — `[FE]` Buat komponen modal/dialog peringatan ramah layar sentuh untuk menampilkan pesan *"Poliklinik sedang tutup"*
- **DI LUAR BACKEND** — `[FE]` Tambahkan tombol tutup/*auto-close timer* pada modal agar layar Kiosk kembali ke tampilan daftar poliklinik

### US-015 — Tampilan Nomor Antrian Real-time via WebSocket
- **DI LUAR BACKEND** — `[FE]` Bangun UI halaman `/display` sesuai wireframe SDD Bab 7 Gambar 5 (panel kartu antrian per poliklinik, total pasien, jam real-time WIB, dan area informasi)
- **CLEAR (kode)** — `[BE]` Buat endpoint inisialisasi data antrian aktif hari ini untuk pemuatan pertama kali halaman Display TV
- **DI LUAR BACKEND** — `[FE]` Hubungkan halaman `/display` dengan event Socket.io (`broadcastUpdate`) untuk memperbarui state antrian tanpa *reload*

### US-016 — Integrasi TTS (Text-to-Speech) untuk Pemanggilan
- **DI LUAR BACKEND** — `[FE]` Buat modul `Controller Audio & TTS` menggunakan Web Speech API (`window.speechSynthesis`) dengan konfigurasi Bahasa Indonesia (`id-ID`)
- **DI LUAR BACKEND** — `[FE]` Implementasikan sistem antrian suara (*audio queue*) agar jika ada dua poli memanggil bersamaan, suara tidak saling tumpang tindih
- **PARTIAL (endpoint pencatatan error audio tersedia; integrasi perangkat/frontend belum ada)** — `[FE/BE]` Tambahkan pengecekan kesiapan perangkat audio; jika gagal/error, batalkan pemutaran, tampilkan *toast* notifikasi error audio di layar, dan kirim log error ke backend (sesuai Sequence Diagram 4)

### US-017 — Auto-Update Tampilan Display Berdasarkan Jenis Perubahan Status
- **CLEAR (kode)** — `[BE]` Sertakan atribut `actionType` (`call`, `recall`, `skip`, `done`) pada payload event WebSocket yang dikirim oleh `SocketManager`
- **DI LUAR BACKEND** — `[FE]` Implementasikan percabangan logika pada `Controller MonitorDisplay` sesuai Sequence Diagram 2 (jika `call`/`recall` $\rightarrow$ update UI + putar TTS; jika `skip`/`done` $\rightarrow$ update UI saja)

### US-018 — Dashboard Loket - Daftar Antrian Poli Aktif
- **CLEAR (kode)** — `[BE]` Buat endpoint `GET /api/antrian` yang memfilter data tabel `Pendaftaran` hari ini berdasarkan poliklinik milik petugas yang sedang login
- **DI LUAR BACKEND** — `[FE]` Bangun UI Panel Loket Petugas sesuai SDD Bab 7 Gambar 6 (kartu nomor antrian dengan kode warna abu-abu, merah, hijau beserta tombol aksi Panggil, Panggil Ulang, Lewati, Selesai)
- **DI LUAR BACKEND** — `[FE]` Integrasikan *listener* Socket.io di Panel Loket agar daftar antrian otomatis diperbarui saat ada perubahan data

### US-019 — Tombol Panggil Antrian
- **CLEAR (kode)** — `[BE]` Implementasikan metode `AntrianController.panggilAntrian()` dengan validasi ketersediaan antrian berstatus `waiting`
- **CLEAR (kode)** — `[BE]` Update `status_pendaftaran` menjadi `called` ("Dipanggil") di database dan panggil `SocketManager.broadcastUpdate()` serta `SocketManager.emitTTS()`
- **DI LUAR BACKEND** — `[FE]` Hubungkan tombol "Panggil" di Panel Loket ke endpoint API dan tampilkan modal peringatan dengan tombol "OK" jika antrian habis (Aliran Alternatif AD 3)

### US-020 — Tombol Panggil Ulang
- **CLEAR (kode)** — `[BE]` Implementasikan metode `AntrianController.panggilUlang()` dengan middleware verifikasi sesi aktif dan pemicu `SocketManager.emitTTS()` (transisi *self-loop* `called` $\rightarrow$ `called` sesuai State Machine SDD 8.1)
- **DI LUAR BACKEND** — `[FE]` Integrasikan tombol "Panggil Ulang" pada Panel Loket dan tampilkan *toast* notifikasi `"Berhasil dipanggil ulang"`

### US-021 — Tombol Lewati (Skip) Antrian
- **CLEAR (kode)** — `[BE]` Implementasikan metode `AntrianController.lewatiAntrian()` untuk mengubah status antrian dari `called` menjadi `skipped` ("Dilewati") di database
- **CLEAR (kode)** — `[BE]` Kirimkan event `SocketManager.broadcastUpdate()` ke Display TV dan Panel Loket tanpa memicu TTS
- **DI LUAR BACKEND** — `[FE]` Integrasikan tombol "Lewati" di Panel Loket dan tampilkan notifikasi `"Antrian berhasil dilewati"`

### US-022 — Tombol Selesai Pelayanan
- **CLEAR (kode)** — `[BE]` Implementasikan metode `AntrianController.selesaiPelayanan()` dengan pengecekan wajib bahwa status saat ini adalah sedang dipanggil/dilayani (`called`)
- **CLEAR (kode)** — `[BE]` Kembalikan pesan error `"Antrian belum dipanggil / tidak sedang dilayani"` (HTTP 400) jika status antrian belum dipanggil
- **CLEAR (kode)** — `[BE]` Ubah status di database menjadi `done` ("Selesai") dan pancarkan pembaruan melalui `SocketManager.broadcastUpdate()`
- **DI LUAR BACKEND** — `[FE]` Hubungkan tombol "Selesai Pelayanan" di Panel Loket serta tampilkan notifikasi `"Selesai"` atau alert pesan error sesuai respons server

### US-023 — Halaman Kelola Poli (List View)
- **CLEAR (kode)** — `[BE]` Implementasikan endpoint `GET /api/admin/poli` pada `AdminController.kelolaPoli()` untuk mengambil daftar poli beserta ringkasan jumlah antrian harian
- **DI LUAR BACKEND** — `[FE]` Bangun UI halaman Manajemen Poli sesuai SDD Bab 7 Gambar 10 yang menampilkan daftar poli, indikator status aktif, dan tombol aksi per poliklinik

### US-024 — Tambah Poli Baru
- **CLEAR (kode)** — `[BE]` Buat endpoint `POST /api/admin/poli` dengan validasi kelengkapan field dan keunikan Primary Key `kode_poli` (`varchar(20)`)
- **DI LUAR BACKEND** — `[FE]` Buat form/modal Tambah Poliklinik (`kode_poli`, `poli`, `deskripsi`) pada halaman Manajemen Poli
- **DI LUAR BACKEND** — `[FE]` Tampilkan notifikasi `"Berhasil tambah"` saat sukses atau pesan error validasi saat input tidak valid (Aliran Alternatif A1 AD 9)

### US-025 — Edit Data Poli
- **CLEAR (kode)** — `[BE]` Buat endpoint `PUT /api/admin/poli/:kode_poli` untuk memvalidasi dan memperbarui kolom `poli` (`varchar(100)`) dan `deskripsi` (`varchar(150)`)
- **DI LUAR BACKEND** — `[FE]` Buat fitur *pre-fill* data lama pada form Edit Poliklinik saat tombol Edit ditekan
- **DI LUAR BACKEND** — `[FE]` Tampilkan notifikasi `"Berhasil update"` setelah perubahan tersimpan dan sinkronkan perubahan ke layar terkait

### US-026 — Hapus Poli
- **CLEAR (kode)** — `[BE]` Buat endpoint `DELETE /api/admin/poli/:kode_poli` dengan penanganan *foreign key constraint* terhadap histori tabel `Pendaftaran`
- **DI LUAR BACKEND** — `[FE]` Buat komponen modal Dialog Konfirmasi Hapus ("Apakah Anda yakin ingin menghapus poli ini?") dengan tombol Setuju dan Batal (Aliran Alternatif A2 AD 9)
- **DI LUAR BACKEND** — `[FE]` Tampilkan notifikasi `"Berhasil hapus"` dan perbarui daftar poli setelah penghapusan berhasil

### US-027 — Buka/Tutup Poli Real-time
- **CLEAR (kode)** — `[BE]` Buat endpoint `PATCH /api/admin/poli/:kode_poli/status` untuk mengubah nilai `aktifonline` (`tinyint(1)`) antara `1` (open) dan `0` (closed) sesuai State Machine Poli SDD 8.1
- **CLEAR (kode)** — `[BE]` Panggil `SocketManager.broadcastUpdate()` setiap kali status poli berubah agar Boundary Kiosk (SD 9 langkah 35) langsung menerima status terbaru
- **DI LUAR BACKEND** — `[FE]` Buat komponen *toggle button* Buka/Tutup Poli di halaman Admin dan tampilkan notifikasi `"Status poli berhasil diperbarui"`

### US-028 — Halaman Kelola Akun Petugas
- **CLEAR (kode)** — `[BE]` Implementasikan endpoint `GET /api/admin/users` pada `AdminController.kelolaUser()` untuk mengambil daftar pengguna dengan `grupuser = 'petugas'` (tanpa mengembalikan hash password)
- **DI LUAR BACKEND** — `[FE]` Bangun UI halaman Manajemen Petugas/Pegawai sesuai SDD Bab 7 Gambar 11 lengkap dengan tabel daftar petugas dan tombol aksi

### US-029 — Tambah Akun Petugas
- **CLEAR (kode)** — `[BE]` Buat endpoint `POST /api/admin/users` dengan validasi keunikan Primary Key `login` (`varchar(50)`), enkripsi password menggunakan `bcrypt`, dan penetapan `grupuser = 'petugas'`
- **DI LUAR BACKEND** — `[FE]` Buat formulir tambah akun petugas dan tampilkan notifikasi `"Proses Berhasil"` atau pesan error validasi sesuai respons backend

### US-030 — Edit Akun Petugas
- **CLEAR (kode)** — `[BE]` Buat endpoint `PUT /api/admin/users/:login` untuk memperbarui `namalengkap`, `poli`, dan `password` (opsional jika diisi) pada tabel `User`
- **DI LUAR BACKEND** — `[FE]` Buat form Edit Akun Petugas dengan *pre-filled data* dan hubungkan tombol `"Simpan"` ke API

### US-031 — Hapus Akun Petugas
- **CLEAR (kode)** — `[BE]` Buat endpoint `DELETE /api/admin/users/:login` dengan proteksi agar Admin tidak dapat menghapus akun miliknya sendiri yang sedang aktif
- **DI LUAR BACKEND** — `[FE]` Tambahkan dialog konfirmasi hapus akun petugas dan tampilkan notifikasi `"Proses Berhasil"` saat penghapusan selesai

### US-032 — Assign Poli ke Petugas
- **DI LUAR BACKEND** — `[FE]` Tambahkan komponen *dropdown* pemilihan Poliklinik (mengambil data dari endpoint `/api/poli`) pada form Tambah dan Edit Akun Petugas
- **CLEAR (kode)** — `[BE]` Pastikan payload token/sesi login petugas menyertakan atribut `User.poli` untuk digunakan sebagai filter otomatis di Panel Loket

### US-033 — Dashboard Rekap Antrian (Default View)
- **PARTIAL (kode/SQL tersedia; perlu verifikasi DB/runtime)** — `[BE]` Implementasikan metode `AdminController.lihatRekap()` pada endpoint `GET /api/admin/rekap` untuk melakukan query ke view `vw_rekap_antrian_harian` (default: tanggal hari ini)
- **DI LUAR BACKEND** — `[FE]` Bangun UI halaman Rekap Antrian sesuai SDD Bab 7 Gambar 12 yang menampilkan tabel rekap antrian (nomor antrian, poli, tanggal, status akhir, durasi tunggu, durasi pelayanan) dan ringkasan statistik

### US-034 — Filter Rekap Berdasarkan Tanggal
- **CLEAR (kode)** — `[BE]` Tambahkan dukungan query parameter `?tanggal=YYYY-MM-DD` pada endpoint `GET /api/admin/rekap`
- **DI LUAR BACKEND** — `[FE]` Tambahkan komponen *Date Picker* dan tombol `"Cari / Filter"` pada halaman Rekap Antrian
- **DI LUAR BACKEND** — `[FE]` Buat tampilan *empty state* yang menampilkan pesan `"Tidak ada data"` apabila hasil pencarian kosong (sesuai AD 10 & SD 10)

### US-035 — Filter Rekap Berdasarkan Poli
- **CLEAR (kode)** — `[BE]` Tambahkan dukungan query parameter `?poli=KODE_POLI` (yang dapat dikombinasikan dengan `?tanggal=YYYY-MM-DD`) pada endpoint `GET /api/admin/rekap`
- **DI LUAR BACKEND** — `[FE]` Tambahkan komponen *dropdown* pilih Poliklinik pada bar pencarian halaman Rekap Antrian dan hubungkan dengan tombol `"Cari / Filter"`

### US-036 — Hitung Durasi Tunggu & Durasi Pelayanan Otomatis
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB]` Buat script DDL SQL `CREATE OR REPLACE VIEW vw_rekap_antrian_harian` yang melakukan `JOIN` tabel `Pendaftaran`, `Poli`, dan `Task_Antrian`
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB]` Implementasikan fungsi `TIMESTAMPDIFF` di dalam View untuk menghitung durasi tunggu (`task1` ke waktu dipanggil/`task2`-`task3`) dan durasi pelayanan (waktu mulai dilayani ke selesai/`task3`-`task5`)
- **PARTIAL (endpoint pencatatan error audio tersedia; integrasi perangkat/frontend belum ada)** — `[BE/FE]` Tampilkan hasil kolom durasi tunggu dan durasi pelayanan (dalam format menit/detik yang mudah dibaca) pada tabel halaman Rekap Antrian

### US-037 — Implementasi Stored Procedure `sp_reset_antrean_harian`
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB]` Buat script SQL untuk Stored Procedure `sp_reset_antrean_harian` sesuai spesifikasi SDD Bab 2.3.2
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB]` Buat MySQL Event (`CREATE EVENT ev_reset_antrean_harian ON SCHEDULE EVERY 1 DAY STARTS ...`) pada pukul `00:00:00` yang memanggil `CALL sp_reset_antrean_harian()`
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Uji pemanggilan manual `CALL sp_reset_antrean_harian()` dan verifikasi bahwa nomor antrian hari baru kembali dimulai dari `1`

### US-038 — Trigger `trg_log_status_pendaftaran` Otomatis
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB]` Buat script DDL SQL `CREATE TRIGGER trg_log_status_pendaftaran AFTER UPDATE ON Pendaftaran FOR EACH ROW` sesuai SDD Bab 2.3.3
- **PARTIAL (SQL tersedia; perlu diterapkan dan diverifikasi pada MySQL target)** — `[DB/BE]` Sinkronkan logika Trigger dan metode `TaskAntrian.catatTask(taskKe, waktu)` (SDD 5.1) agar setiap transisi status mengisi kolom `task2`, `task3`, `task4`, atau `task5` secara konsisten
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Lakukan pengujian perubahan status antrian dari `waiting` $\rightarrow$ `called` $\rightarrow$ `done` dan verifikasi kelengkapan isi timestamp di tabel `Task_Antrian`

### US-039 — Pengujian Performa Response Time Update Data $< 5$ Detik
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Siapkan skenario pengujian multi-client secara simultan (simulasi 3 Kiosk, Display TV, dan beberapa Loket Poli)
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Ukur selisih waktu (*latency*) antara pengiriman request di Panel Loket hingga ter-rendernya perubahan di Display TV menggunakan *Browser DevTools Network/Performance*
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Dokumentasikan hasil pengujian waktu respons ($< 5$ detik) ke dalam laporan pengujian

### US-040 — Testing & Dokumentasi API (REST)
- **CLEAR (artifact Postman tersedia; eksekusi test belum dilakukan)** — `[BE/QA]` Buat Postman Collection atau spesifikasi Swagger/OpenAPI untuk seluruh endpoint modul Autentikasi, Kiosk, Loket, Poli, Akun Petugas, dan Rekap Antrian
- **CLEAR (dokumentasi tersedia)** — `[QA]` Dokumentasikan daftar nama event dan struktur *payload* WebSocket (Socket.io)
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Jalankan *automated/manual API test* untuk skenario positif dan negatif pada setiap endpoint

### US-041 — Setup Server Produksi RS (Ubuntu Server)
- **BELUM DILAKUKAN (butuh lingkungan/perangkat sebenarnya)** — `[Ops]` Instalasi dan konfigurasi Node.js v18 LTS+, MySQL 8.x, Nginx, dan PM2 pada Server Fisik RS
- **BELUM DILAKUKAN (butuh lingkungan/perangkat sebenarnya)** — `[Ops]` Konfigurasi `.env` produksi (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN=8h`, `PORT=3001`, `CLIENT_URL`) sesuai tabel SDD Bab 9.2.c
- **PARTIAL (konfigurasi PM2 contoh tersedia; belum dijalankan di server)** — `[Ops]` Jalankan build produksi Next.js dan Express.js di bawah manajemen PM2 (`pm2 start`, `pm2 save`, `pm2 startup`)
- **BELUM DILAKUKAN (butuh lingkungan/perangkat sebenarnya)** — `[Ops]` Konfigurasi Firewall server (buka port 80 & 443 untuk LAN, batasi port 3306 hanya untuk internal server)

### US-042 — Setup Mode Kiosk & Display TV (Fullscreen)
- **CLEAR (script tersedia; belum diuji di perangkat)** — `[Ops]` Buat script *startup* browser (`--kiosk` / `--start-fullscreen`) untuk perangkat Kiosk menuju URL `https://[IP_SERVER]/kiosk`
- **CLEAR (script tersedia; belum diuji di perangkat)** — `[Ops]` Buat script *startup* browser (`--start-fullscreen --autoplay-policy=no-user-gesture-required`) untuk perangkat Display TV menuju URL `https://[IP_SERVER]/display`
- **BELUM DILAKUKAN (butuh lingkungan/perangkat sebenarnya)** — `[Ops]` Uji fungsi layar sentuh pada Kiosk dan keluaran suara speaker pada Display TV di ruang tunggu

### US-043 — Pengujian End-to-End di Lingkungan RS
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Laksanakan pengujian UAT untuk FR-01 (Login & Role Redirect) dan FR-02 (Pengambilan Tiket Kiosk Poli Buka/Tutup)
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Laksanakan pengujian UAT untuk FR-03 (Panggil, Panggil Ulang, Lewati, Selesai), FR-04 (Suara Otomatis TTS), dan FR-05 (Real-time Display TV)
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Laksanakan pengujian UAT untuk FR-06 (CRUD & Buka/Tutup Poli Real-time), FR-07 (CRUD Akun Petugas), dan FR-08 (Filter Rekap Antrian Harian)
- **BELUM DILAKUKAN (butuh hasil pengujian nyata)** — `[QA]` Dokumentasikan berita acara / hasil pengujian UAT bersama perwakilan pengguna operasional

## Penting sebelum dianggap final

- `CLEAR (kode)` berarti implementasi backend/config/script sudah ada. Itu tidak otomatis membuktikan skenario berjalan pada database RS.
- Migrasi Prisma, generate client, penerapan `database/objects.sql`, stored procedure, trigger, dan MySQL Event Scheduler perlu dijalankan di database development terlebih dahulu.
- Tes API Postman, pengukuran latency <5 detik, tes perangkat touchscreen/speaker, konfigurasi server produksi, dan UAT perlu bukti hasil aktual sebelum checklist QA/Ops ditandai selesai.
- Untuk integrasi SIMRS, validasi ulang `schema.prisma` menggunakan skema yang disetujui. Jangan menjalankan migrasi ke database produksi hanya karena model baseline tersedia.

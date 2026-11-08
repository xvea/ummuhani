# Socket.io Event Contract

Socket.io menggunakan URL yang sama dengan server HTTP. Frontend menginisialisasi koneksi dan menjalankan event join sesuai layar.

## Client -> server

| Event | Payload | Efek |
|---|---|---|
| `join:poli` | `"UMUM"` | Masuk ke room `poli:UMUM` |
| `leave:poli` | `"UMUM"` | Keluar dari room `poli:UMUM` |
| `join:display` | tanpa payload | Menerima broadcast khusus display |
| `join:kiosk` | tanpa payload | Menerima update daftar/status poli di kiosk |
| `join:loket` | `"UMUM"` | Masuk ke room event poli yang ditugaskan |

## Server -> client

| Event | Payload penting | Penggunaan |
|---|---|---|
| `queue:update` | `{ actionType, queue }` | Update per room poli/global/display/kiosk |
| `queue:update:all` | `{ actionType, queue }` | Event broadcast ke seluruh client; berguna untuk monitoring/test |
| `queue:tts` | `{ actionType, tiketreg, nomor_tiket, noantripoli, poli, nama_poli, text }` | Display mengantre suara Web Speech API `id-ID`; hanya `call` dan `recall` |
| `poli:update` | `{ actionType, poli }` | Kiosk memperbarui daftar atau status poli |
| `poli:status` | `{ actionType, poli }` | Alias event kompatibilitas untuk perubahan poli |

`actionType` antrean: `create`, `call`, `recall`, `skip`, `done`. UI Display sebaiknya memutar TTS hanya untuk `call` dan `recall`, bukan `skip` atau `done`.

Contoh client:

```js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001');
socket.emit('join:display');
socket.on('queue:update', ({ actionType, queue }) => {
  // Update state/display tanpa reload.
});
socket.on('queue:tts', ({ text }) => {
  // UI Display: enqueue speechSynthesis utterance dengan lang = 'id-ID'.
});
```

Socket.io-client diperlukan pada frontend Next.js dan sengaja tidak menjadi dependency backend.

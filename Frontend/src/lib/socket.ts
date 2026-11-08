"use client";

import { io, type Socket } from "socket.io-client";

/**
 * Alamat Socket.io. Kosong = alamat Frontend yang sama (diteruskan ke Backend oleh
 * rewrites di next.config.ts / Nginx). Isi NEXT_PUBLIC_SOCKET_URL hanya jika perlu.
 */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socket: Socket | null = null;

/**
 * Satu koneksi Socket.io untuk seluruh halaman (Kiosk, Display, Panel Loket).
 * Event dari Backend: queue:update, queue:tts, poli:update (lihat Backend/docs/SOCKET.md).
 */
export function getSocket(): Socket {
  if (!socket) {
    // Transport bawaan Socket.io: mulai dengan polling lalu otomatis naik ke WebSocket.
    socket = SOCKET_URL ? io(SOCKET_URL) : io();
  }
  return socket;
}

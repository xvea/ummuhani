"use client";

import { io, type Socket } from "socket.io-client";

/** Alamat Socket.io Backend. Diatur di .env.local (NEXT_PUBLIC_SOCKET_URL). */
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

let socket: Socket | null = null;

/**
 * Satu koneksi Socket.io untuk seluruh halaman (Kiosk, Display, Panel Loket).
 * Event dari Backend: queue:update, queue:tts, poli:update (lihat Backend/docs/SOCKET.md).
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
  }
  return socket;
}

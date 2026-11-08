import type { NextConfig } from "next";

/**
 * Alamat Backend Express untuk server Next.js (tidak dikirim ke browser).
 * Browser cukup memanggil /api/... dan /socket.io/... di alamat Frontend yang sama,
 * lalu Next.js meneruskannya ke Backend. Hasilnya:
 * - Kiosk/Display/Loket yang membuka http://[IP_KOMPUTER]:3000 tetap tersambung ke Backend.
 * - Tidak ada masalah CORS, dan polanya sama dengan Nginx di server RS (SDD Bab 9).
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Socket.io memakai alamat /socket.io/ (dengan garis miring di akhir), jangan dialihkan.
  skipTrailingSlashRedirect: true,
  // Izinkan perangkat lain di jaringan lokal (kiosk, TV, loket) membuka dev server.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/socket.io/", destination: `${BACKEND_URL}/socket.io/` },
      { source: "/socket.io/:path*", destination: `${BACKEND_URL}/socket.io/:path*` },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import { apiFetch } from "./api";
import type { Poli } from "./types";

/**
 * Lapisan data Kiosk (FR-02).
 * Halaman Kiosk hanya memakai tipe di file ini, bukan bentuk mentah respons Backend.
 * Jika nanti Backend/database RS berubah, cukup sesuaikan fungsi di sini.
 */

export type JenisPasien = "BPJS" | "UMUM";

export type KioskPoli = {
  kode: string;
  nama: string;
  deskripsi: string | null;
  buka: boolean;
  menunggu: number; // jumlah antrian menunggu hari ini
  dokter: string | null; // diisi setelah modul Dokter & Jadwal di Backend siap
  jadwal: string | null; // contoh "14:00 - 17:00 WIB", diisi setelah modul Jadwal siap
};

export type KioskData = {
  polies: KioskPoli[];
  totalMenunggu: number;
};

export type Tiket = {
  nomor: string;
  poliKode: string;
  poliNama: string;
  dokter: string | null;
  jenis: JenisPasien;
  waktu: string; // ISO string
  sisaAntrian: number;
};

type DisplayState = {
  polies: Array<{ kode_poli: string; totalMenunggu: number }>;
};

type CreateQueueResponse = {
  tiketreg: string;
  nomor_tiket?: string;
  poli: string;
  poliRef?: { poli: string } | null;
  dokterRef?: { namadokter: string } | null;
};

/** Ambil daftar poli + jumlah antrian menunggu per poli. */
export async function fetchKioskData(): Promise<KioskData> {
  const [polies, display] = await Promise.all([
    apiFetch<Poli[]>("/api/poli"),
    apiFetch<DisplayState>("/api/antrian/display").catch(() => ({ polies: [] }) as DisplayState),
  ]);
  const waiting = new Map(display.polies.map((row) => [row.kode_poli, row.totalMenunggu]));
  const list: KioskPoli[] = polies.map((poli) => ({
    kode: poli.kode_poli,
    nama: poli.poli,
    deskripsi: poli.deskripsi,
    buka: poli.aktifonline === 1,
    menunggu: waiting.get(poli.kode_poli) ?? 0,
    dokter: null,
    jadwal: null,
  }));
  // Poli yang buka ditampilkan lebih dulu (sesuai desain Figma)
  list.sort((a, b) => Number(b.buka) - Number(a.buka) || a.nama.localeCompare(b.nama, "id"));
  return { polies: list, totalMenunggu: list.reduce((sum, poli) => sum + poli.menunggu, 0) };
}

/** Ambil tiket antrian (POST /api/antrian). Melempar ApiError 409 jika poli tutup. */
export async function ambilTiket(poli: KioskPoli, jenis: JenisPasien): Promise<Tiket> {
  const created = await apiFetch<CreateQueueResponse>("/api/antrian", {
    method: "POST",
    body: { poli: poli.kode, jenisantrian: jenis },
  });
  // Antrean loket bersama untuk semua poli: sisa = semua antrian menunggu selain tiket ini
  const latest = await fetchKioskData().catch(() => null);
  return {
    nomor: created.nomor_tiket ?? created.tiketreg,
    poliKode: created.poli,
    poliNama: created.poliRef?.poli ?? poli.nama,
    dokter: created.dokterRef?.namadokter ?? poli.dokter,
    jenis,
    waktu: new Date().toISOString(),
    sisaAntrian: Math.max(0, (latest?.totalMenunggu ?? 1) - 1),
  };
}

/** Format jam (HH:MM) dan tanggal dalam WIB. */
export function formatJam(date: Date) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("hour")}:${get("minute")}`;
}

export function formatTanggal(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

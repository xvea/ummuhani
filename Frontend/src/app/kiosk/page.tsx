import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { fetchKioskData, type KioskData } from "@/lib/kiosk";
import { KioskApp } from "./KioskApp";

export const metadata: Metadata = { title: "Kiosk Antrian – RS Ummu Hani" };

/**
 * Halaman Kiosk (FR-02). Daftar poli dimuat di server lebih dulu (SSR, SDD Bab 1)
 * supaya layar langsung terisi, lalu diperbarui real-time di browser.
 */
export default function KioskPage() {
  return (
    <Suspense fallback={<KioskLoading />}>
      <KioskLoader />
    </Suspense>
  );
}

async function KioskLoader() {
  let data: KioskData = { polies: [], totalMenunggu: 0 };
  let error = false;
  try {
    data = await fetchKioskData();
  } catch {
    error = true; // Backend belum menyala: Kiosk tetap tampil dan mencoba lagi lewat Socket.io
  }
  return <KioskApp initialData={data} initialError={error} />;
}

function KioskLoading() {
  return (
    <div className="bg-medical-gradient flex h-dvh flex-col items-center justify-center gap-6">
      <Logo priority className="h-20" />
      <p className="text-2xl font-semibold text-slate-700">Memuat layanan antrian…</p>
    </div>
  );
}

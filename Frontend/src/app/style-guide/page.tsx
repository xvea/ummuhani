import Link from "next/link";
import { RotateCcw, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { QueueNumber } from "@/components/ui/QueueNumber";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Halaman contoh untuk memastikan design system Figma sudah terpasang dengan benar. */
const brandColors = [
  { name: "Emerald Primary", hex: "#2E7D32", className: "bg-primary", use: "Tombol & aksen utama" },
  { name: "Emerald Dark", hex: "#1B5E20", className: "bg-primary-dark", use: "Hover & state aktif" },
  { name: "Emerald Soft", hex: "#E8F5E9", className: "bg-primary-soft", use: "Background tag/badge" },
  { name: "Warm Orange", hex: "#E65100", className: "bg-accent-orange", use: "Aksen logo & highlight" },
  { name: "Warm Yellow", hex: "#FBC02D", className: "bg-accent-yellow", use: "Aksen logo & status" },
  { name: "Medical Blue", hex: "#0284C7", className: "bg-medical", use: "Latar web & info" },
];

export default function StyleGuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo priority />
          <div>
            <h1 className="text-3xl font-bold">Style Guide</h1>
            <p className="text-muted">Design system dari Figma &quot;RS Ummu Hani Mock Up&quot;</p>
          </div>
        </div>
        <Link href="/" className="text-sm font-semibold text-medical underline">
          Kembali
        </Link>
      </header>

      <Card>
        <h2 className="text-xl font-semibold">1. Warna identitas RS</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-6">
          {brandColors.map((color) => (
            <div key={color.name} className="overflow-hidden rounded-xl border border-line">
              <div className={`h-16 ${color.className}`} />
              <div className="p-3">
                <p className="text-sm font-semibold">{color.name}</p>
                <p className="text-xs text-muted">{color.hex}</p>
                <p className="mt-1 text-xs text-primary">{color.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">2. Status antrian (SDD Bab 8)</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <StatusBadge status="waiting" />
          <StatusBadge status="called" />
          <StatusBadge status="done" />
          <StatusBadge status="skipped" />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">3. Tipografi (Plus Jakarta Sans)</h2>
        <div className="mt-4 flex flex-col gap-3">
          <QueueNumber value="A-024 / B-105" size="lg" />
          <p className="text-3xl font-bold">SISTEM ANTRIAN RS UMMU HANI</p>
          <p className="text-xl font-semibold">Daftar Antrian Aktif - Loket Pendaftaran</p>
          <p className="text-base font-medium">Pasien: Bpk. Bambang Pamungkas (No. RM: 004821)</p>
          <p className="text-xs text-muted">Waktu Kedatangan: 08:32 WIB • Loket 02 Pendaftaran</p>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">4. Tombol</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button>
            <Volume2 className="size-4" /> Panggil Nomor Berikutnya
          </Button>
          <Button variant="outline">
            <RotateCcw className="size-4" /> Panggil Ulang (Recall)
          </Button>
          <Button variant="danger">
            <SkipForward className="size-4" /> Lewati (Skip)
          </Button>
          <Button variant="neutral">Kembali</Button>
          <Button disabled>Tidak Aktif</Button>
        </div>
        <div className="mt-4">
          <Button size="xl">Tekan Disini (ukuran Kiosk)</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">5. Kartu antrian</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase">Loket 01</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">SEDANG DIPANGGIL</span>
            </div>
            <QueueNumber value="A-014" size="lg" className="mt-2 block text-white" />
          </div>
          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted uppercase">Antrian berikutnya</span>
              <StatusBadge status="waiting" />
            </div>
            <QueueNumber value="A-015" size="lg" />
            <p className="text-sm text-muted">Total antrian menunggu: 18 pasien</p>
          </Card>
        </div>
      </Card>
    </main>
  );
}

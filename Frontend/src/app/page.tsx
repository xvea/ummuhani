import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

/**
 * Halaman awal selama pengembangan: daftar semua halaman sistem.
 * Saat deployment, tiap perangkat langsung membuka URL-nya sendiri (SDD Bab 9).
 */
const pages = [
  { href: "/kiosk", title: "Kiosk Ambil Tiket", desc: "Pasien memilih BPJS/UMUM lalu poli", acuan: "FR-02", ready: false },
  { href: "/display", title: "Display Ruang Tunggu", desc: "Nomor dipanggil + nomor loket, suara TTS", acuan: "FR-04, FR-05", ready: false },
  { href: "/login", title: "Login Petugas & Admin", desc: "Masuk sesuai role", acuan: "FR-01", ready: false },
  { href: "/dashboard", title: "Dashboard Petugas & Admin", desc: "Panel Loket, Pendaftaran, Admin", acuan: "FR-03, FR-06–FR-08", ready: false },
  { href: "/style-guide", title: "Style Guide", desc: "Warna, font, dan komponen dari Figma", acuan: "Figma", ready: true },
];

export default function Home() {
  return (
    <main className="bg-medical-gradient flex flex-1 flex-col items-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo priority className="h-16" />
        <h1 className="text-3xl font-bold">Sistem Antrian RS Ummu Hani</h1>
        <p className="text-muted">Daftar halaman (mode pengembangan)</p>
      </div>
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{page.title}</h2>
                <span
                  className={
                    page.ready
                      ? "rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success"
                      : "rounded-full bg-waiting-soft px-2 py-0.5 text-xs font-bold text-waiting"
                  }
                >
                  {page.ready ? "Siap" : "Dalam pengerjaan"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{page.desc}</p>
              <p className="mt-3 text-xs font-semibold text-primary">
                {page.href} · {page.acuan}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

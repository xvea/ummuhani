import type { ReactNode } from "react";
import { ArrowDown, BadgeCheck, CheckCircle2, Monitor, Printer, RotateCw, Volume2, Wallet } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { formatJam, formatTanggal, type Tiket } from "@/lib/kiosk";
import { cn } from "@/lib/utils";

export const ALAMAT_RS = "JL. MAYJEND SUNGKONO NO. 46, PURBALINGGA";

/** Layar 3 – Tiket tercetak (Figma "Kiosk Antrian - 3. Tiket Tercetak"). */
export function TiketTercetak({
  tiket,
  sisaDetik,
  totalDetik,
  onSelesai,
}: {
  tiket: Tiket;
  sisaDetik: number;
  totalDetik: number;
  onSelesai: () => void;
}) {
  const waktu = new Date(tiket.waktu);
  const bpjs = tiket.jenis === "BPJS";
  const progress = Math.max(0, Math.min(100, (sisaDetik / totalDetik) * 100));

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-4 xl:gap-6 xl:px-10 xl:py-8">
      <div className="grid flex-1 items-center gap-6 md:grid-cols-2">
        {/* Pratinjau tiket */}
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-xl">
          <div className="h-3 bg-slate-800" />
          <div className="flex flex-col items-center gap-2 px-6 py-4 text-center xl:gap-3 xl:py-6">
            <Logo className="h-8" />
            <p className="text-xs tracking-wider text-slate-500">{ALAMAT_RS}</p>
            <p className="w-full rounded-lg border border-green-200 bg-green-50 py-2 text-sm font-bold tracking-wider text-primary">
              TIKET ANTRIAN PENDAFTARAN
            </p>
            <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-slate-500">NOMOR GILIRAN ANDA</p>
            <p className="whitespace-nowrap text-6xl font-extrabold tracking-tight text-primary xl:text-8xl">{tiket.nomor}</p>
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold",
                bpjs ? "border-green-200 bg-green-50 text-primary-dark" : "border-sky-200 bg-sky-50 text-sky-800",
              )}
            >
              {bpjs ? <BadgeCheck className="size-4" /> : <Wallet className="size-4" />}
              {bpjs ? "PASIEN BPJS KESEHATAN" : "PASIEN UMUM"}
            </span>
            <dl className="mt-3 w-full divide-y divide-line rounded-xl border border-line bg-surface px-4 text-left text-sm">
              <div className="flex items-start justify-between gap-3 py-2">
                <dt className="text-slate-500">Tujuan Poliklinik</dt>
                <dd className="text-right">
                  <span className="block font-bold uppercase">{tiket.poliNama}</span>
                  {tiket.dokter && <span className="text-slate-500">{tiket.dokter}</span>}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <dt className="text-slate-500">Langkah Berikutnya</dt>
                <dd className="rounded-md border border-green-200 bg-green-50 px-2 py-1 text-right font-bold text-primary-dark">
                  Tunggu panggilan ke loket
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <dt className="text-slate-500">Sisa Antrian</dt>
                <dd className="rounded-md bg-waiting-soft px-2 py-1 font-bold text-amber-800">
                  {tiket.sisaAntrian} Pasien Menunggu
                </dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-slate-500">
              {formatTanggal(waktu)} • {formatJam(waktu)} WIB
            </p>
          </div>
          <div className="h-3 bg-[radial-gradient(circle_at_8px_12px,_#e2e8f0_6px,_transparent_7px)] bg-[length:16px_12px]" />
        </div>

        {/* Petunjuk */}
        <div className="flex flex-col gap-4">
          <InfoCard
            icon={<ArrowDown className="size-7" />}
            iconClass="bg-orange-100 text-accent-orange"
            title="Ambil Kertas Tiket"
            subtitle="Periksa corong dispenser printer di bawah layar"
          >
            <p className="flex gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-base text-slate-700 xl:text-lg">
              <Printer className="mt-1 size-6 shrink-0 text-primary" />
              <span>
                Silakan ambil tiket di <b>lubang dispenser printer</b> lalu duduk dan menunggu panggilan di{" "}
                <b>Ruang Tunggu Pendaftaran</b>.
              </span>
            </p>
          </InfoCard>
          <InfoCard
            icon={<Monitor className="size-7" />}
            iconClass="bg-sky-100 text-sky-700"
            title="Pantau Layar Panggilan"
            subtitle="Display TV & pengeras suara ruang tunggu"
          >
            <p className="text-base text-slate-700 xl:text-lg">
              Nomor Anda{" "}
              <span className="rounded-md border border-green-200 bg-green-50 px-2 font-bold text-primary">{tiket.nomor}</span>{" "}
              akan diumumkan melalui pengeras suara dan layar TV, beserta <b>nomor loket</b> yang harus Anda datangi.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-primary">
              <Volume2 className="size-5" /> Dengarkan panggilan dengan saksama
            </p>
          </InfoCard>
          <div className="rounded-2xl bg-white p-4 shadow-sm xl:p-5">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold tracking-wider text-slate-600">WAKTU SESI MANDIRI</span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-green-200 px-3 py-1 font-bold text-primary">
                <RotateCw className="size-4" /> {sisaDetik}s
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-base text-slate-600">
              Layar kembali otomatis ke menu awal dalam <b>{sisaDetik} detik</b>.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelesai}
        className="flex h-16 shrink-0 items-center justify-center gap-3 rounded-2xl bg-primary text-2xl xl:h-20 font-bold text-white shadow-lg active:scale-[0.99] xl:text-3xl"
      >
        <CheckCircle2 className="size-8" /> SELESAI / KEMBALI KE MENU AWAL
      </button>
    </div>
  );
}

function InfoCard({
  icon,
  iconClass,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm xl:p-5">
      <div className="mb-3 flex items-center gap-4">
        <span className={cn("flex size-14 items-center justify-center rounded-2xl", iconClass)}>{icon}</span>
        <div>
          <p className="text-xl font-bold">{title}</p>
          <p className="text-base text-slate-600">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

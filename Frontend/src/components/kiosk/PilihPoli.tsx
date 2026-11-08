import {
  ArrowLeft,
  Baby,
  BadgeCheck,
  Bone,
  CircleHelp,
  Clock,
  Eye,
  HeartPulse,
  Hospital,
  Loader2,
  Radio,
  Smile,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import type { JenisPasien, KioskPoli } from "@/lib/kiosk";
import { cn } from "@/lib/utils";

/** Ikon poli berdasarkan nama poli. */
function PoliIcon({ nama, className }: { nama: string; className?: string }) {
  const n = nama.toLowerCase();
  if (n.includes("anak")) return <Baby className={className} />;
  if (n.includes("gigi")) return <Smile className={className} />;
  if (n.includes("mata")) return <Eye className={className} />;
  if (n.includes("jantung") || n.includes("kandungan") || n.includes("obgyn")) return <HeartPulse className={className} />;
  if (n.includes("tulang") || n.includes("bedah")) return <Bone className={className} />;
  if (n.includes("dalam") || n.includes("umum")) return <Stethoscope className={className} />;
  return <Hospital className={className} />;
}

/** Layar 2 – Pilih poliklinik tujuan (Figma "Kiosk Antrian - 2"). */
export function PilihPoli({
  jenis,
  polies,
  loadError,
  submittingKode,
  onBack,
  onPilih,
}: {
  jenis: JenisPasien;
  polies: KioskPoli[];
  loadError: boolean;
  submittingKode: string | null;
  onBack: () => void;
  onPilih: (poli: KioskPoli) => void;
}) {
  const jumlahBuka = polies.filter((poli) => poli.buka).length;
  const bpjs = jenis === "BPJS";

  return (
    <div className="flex flex-1 flex-col gap-5 px-6 py-5 xl:px-10 xl:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-16 items-center gap-3 rounded-2xl bg-white px-6 text-xl font-bold tracking-wide shadow-sm active:scale-95"
        >
          <ArrowLeft className="size-7" /> KEMBALI
        </button>
        <div className="flex items-center gap-3">
          <span className="text-lg text-slate-700">Kategori Registrasi:</span>
          <span
            className={cn(
              "inline-flex items-center gap-3 rounded-full px-6 py-3 text-white",
              bpjs ? "bg-primary" : "bg-sky-700",
            )}
          >
            {bpjs ? <BadgeCheck className="size-7" /> : <Wallet className="size-7" />}
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-widest opacity-90">JENIS PASIEN</span>
              <span className="text-xl font-extrabold">{bpjs ? "BPJS KESEHATAN" : "UMUM"}</span>
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight xl:text-5xl">PILIH POLIKLINIK TUJUAN</h1>
          <p className="mt-1 text-lg text-slate-700 xl:text-xl">
            Sentuh salah satu kartu poliklinik yang buka untuk mencetak tiket antrian.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-bold text-primary-dark shadow-sm">
          <Radio className="size-5" /> POLI BUKA: {jumlahBuka} POLI
        </span>
      </div>

      {loadError || polies.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-white/80 p-10 text-center">
          <CircleHelp className="size-14 text-muted" />
          <p className="text-2xl font-bold">
            {loadError ? "Daftar poliklinik belum dapat dimuat" : "Belum ada poliklinik terdaftar"}
          </p>
          <p className="text-lg text-slate-600">Silakan hubungi Petugas Informasi RS Ummu Hani.</p>
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-min content-start gap-5 overflow-y-auto pb-2 sm:grid-cols-2 lg:grid-cols-3">
          {polies.map((poli) => (
            <PoliCard
              key={poli.kode}
              poli={poli}
              loading={submittingKode === poli.kode}
              disabled={submittingKode !== null}
              onClick={() => onPilih(poli)}
            />
          ))}
        </div>
      )}

      <p className="flex items-center gap-3 rounded-2xl bg-white/90 px-6 py-4 text-lg text-slate-700 shadow-sm">
        <CircleHelp className="size-7 shrink-0 text-medical" />
        <span>
          Jika poli tujuan tidak terdaftar atau tutup, hubungi{" "}
          <span className="font-bold text-primary-dark">Petugas Informasi RS Ummu Hani</span>.
        </span>
      </p>
    </div>
  );
}

function PoliCard({
  poli,
  loading,
  disabled,
  onClick,
}: {
  poli: KioskPoli;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col gap-3 rounded-3xl border-l-8 p-5 text-left shadow-md transition active:scale-[0.98] disabled:cursor-wait",
        poli.buka ? "border-primary bg-white" : "border-slate-300 bg-white/50 shadow-none",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl",
            poli.buka ? "bg-primary-soft text-primary" : "bg-slate-100 text-slate-400",
          )}
        >
          {loading ? <Loader2 className="size-7 animate-spin" /> : <PoliIcon nama={poli.nama} className="size-7" />}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold",
            poli.buka ? "bg-primary-soft text-primary-dark" : "bg-skipped-soft text-skipped",
          )}
        >
          <span className="size-2 rounded-full bg-current" />
          {poli.buka ? "BUKA" : "TUTUP"}
        </span>
      </div>
      <div className={cn(!poli.buka && "opacity-60")}>
        <p className="text-2xl font-bold">{poli.nama}</p>
        {poli.deskripsi && <p className="mt-1 text-base text-slate-600">{poli.deskripsi}</p>}
      </div>
      <div
        className={cn(
          "mt-auto flex items-center justify-between rounded-xl px-4 py-3 text-base",
          poli.buka ? "bg-surface" : "bg-white/60 text-slate-500",
        )}
      >
        {poli.buka ? (
          <>
            <span className="inline-flex items-center gap-2 font-semibold">
              {poli.dokter ? (
                <>
                  <Stethoscope className="size-5 text-primary" /> {poli.dokter}
                </>
              ) : (
                <>
                  <Users className="size-5 text-primary" /> Menunggu: {poli.menunggu} orang
                </>
              )}
            </span>
            <span className="text-sm font-bold text-primary">Tersedia</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-2 font-semibold">
            <Clock className="size-5" /> {poli.jadwal ? `Praktek ${poli.jadwal}` : "Belum menerima pendaftaran"}
          </span>
        )}
      </div>
    </button>
  );
}

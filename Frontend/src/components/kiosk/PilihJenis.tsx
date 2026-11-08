import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, CreditCard, IdCard, ShieldPlus, Wallet } from "lucide-react";
import type { JenisPasien } from "@/lib/kiosk";
import { cn } from "@/lib/utils";

/** Layar 1 – Selamat Datang, pilih jenis penjaminan (Figma "Kiosk Antrian - 1"). */
export function PilihJenis({
  totalMenunggu,
  onPilih,
}: {
  totalMenunggu: number;
  onPilih: (jenis: JenisPasien) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-5 px-6 py-5 xl:gap-8 xl:px-10 xl:py-10">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink xl:text-6xl">
          SELAMAT DATANG DI <span className="text-primary-dark">RS UMMU HANI</span>
        </h1>
        <p className="mt-3 text-lg text-slate-700 xl:text-2xl">
          Sentuh jenis penjaminan untuk mengambil nomor tiket antrian pendaftaran
        </p>
      </div>

      <div className="grid flex-1 gap-6 md:grid-cols-2">
        <JenisCard
          tone="green"
          icon={<ShieldPlus className="size-9 xl:size-12" />}
          badge={
            <>
              <BadgeCheck className="size-4" /> JKN / KIS
            </>
          }
          title="PASIEN BPJS"
          desc="Membawa Kartu BPJS / KTP / Rujukan Faskes Tingkat 1"
          onClick={() => onPilih("BPJS")}
        />
        <JenisCard
          tone="blue"
          icon={<CreditCard className="size-9 xl:size-12" />}
          badge={
            <>
              <Wallet className="size-4" /> NON-BPJS
            </>
          }
          title="PASIEN UMUM"
          desc="Pembayaran Mandiri, Tunai/Debit, atau Asuransi Rekanan"
          onClick={() => onPilih("UMUM")}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/90 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-orange-100 text-accent-orange">
            <IdCard className="size-6" />
          </span>
          <div>
            <p className="text-lg font-bold">Petunjuk Berkas</p>
            <p className="text-base text-slate-600">
              Harap siapkan KTP asli &amp; surat rujukan (jika ada) sebelum menuju loket pendaftaran
            </p>
          </div>
        </div>
        <p className="flex items-center gap-2 text-lg font-semibold text-slate-700">
          <span className="size-3 rounded-full bg-primary" /> Antrian menunggu:{" "}
          <span className="font-extrabold text-ink">{totalMenunggu} Orang</span>
        </p>
      </div>
    </div>
  );
}

function JenisCard({
  tone,
  icon,
  badge,
  title,
  desc,
  onClick,
}: {
  tone: "green" | "blue";
  icon: ReactNode;
  badge: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  const green = tone === "green";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col justify-between gap-4 xl:gap-6 rounded-3xl border-l-[12px] bg-white p-6 text-left shadow-lg transition active:scale-[0.98] xl:p-10",
        green ? "border-primary-dark" : "border-sky-700",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-2xl text-ink xl:size-24",
            green ? "bg-green-200" : "bg-sky-100",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white xl:text-base",
            green ? "bg-primary-dark" : "bg-sky-700",
          )}
        >
          {badge}
        </span>
      </div>
      <div>
        <p className={cn("text-5xl font-extrabold tracking-tight xl:text-7xl", green ? "text-primary-dark" : "text-sky-800")}>
          {title}
        </p>
        <p className="mt-3 text-lg text-slate-700 xl:text-2xl">{desc}</p>
      </div>
      <span
        className={cn(
          "flex h-16 items-center justify-between rounded-2xl px-6 text-xl font-bold text-white xl:h-20 xl:text-2xl",
          green ? "bg-primary-dark group-hover:bg-green-900" : "bg-sky-800 group-hover:bg-sky-900",
        )}
      >
        Tekan Disini <ArrowRight className="size-8" />
      </span>
    </button>
  );
}

import { ArrowLeft, CalendarX2, ClipboardList, Clock, Headset, Info, Loader } from "lucide-react";
import type { KioskPoli } from "@/lib/kiosk";

/** Layar 4 – Peringatan poli sedang tutup (Figma "Kiosk Antrian - 4"). Alur alternatif FR-02. */
export function PoliTutupModal({
  poli,
  sisaDetik,
  infoPetugas,
  onKembali,
  onTanyaPetugas,
}: {
  poli: KioskPoli;
  sisaDetik: number;
  infoPetugas: boolean;
  onKembali: () => void;
  onTanyaPetugas: () => void;
}) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="judul-poli-tutup"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/70 p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 text-center shadow-2xl xl:p-10">
        <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-amber-800" />
        <div className="relative mx-auto flex size-28 items-center justify-center rounded-full bg-orange-100">
          <Clock className="size-14 text-amber-800" strokeDasharray="3 3" />
          <span className="absolute right-0 bottom-0 flex size-11 items-center justify-center rounded-full bg-accent-orange text-white">
            <CalendarX2 className="size-6" />
          </span>
        </div>
        <span className="mt-6 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold tracking-wider text-ink">
          STATUS LAYANAN KLINIK
        </span>
        <h2 id="judul-poli-tutup" className="mt-3 text-4xl font-extrabold tracking-tight xl:text-5xl">
          POLIKLINIK SEDANG TUTUP
        </h2>
        <p className="mt-4 text-xl text-slate-700">
          Mohon maaf, <span className="font-bold text-amber-800">{poli.nama}</span> saat ini belum menerima
          pendaftaran antrian mandiri.
        </p>

        {poli.jadwal && (
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-left">
            <span className="flex size-14 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <ClipboardList className="size-7" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wider text-slate-600">INFORMASI JADWAL PELAYANAN PRAKTEK:</p>
              <p className="text-2xl font-bold text-primary-dark">Pukul {poli.jadwal}</p>
              {poli.dokter && <p className="text-lg text-slate-700">Dokter Pemeriksa: {poli.dokter}</p>}
            </div>
          </div>
        )}

        <p className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 text-left text-lg text-slate-700">
          <Info className="mt-1 size-6 shrink-0 text-sky-700" />
          {infoPetugas ? (
            <span>
              Silakan menuju meja <b>Petugas Informasi</b> di samping mesin kiosk ini. Petugas akan membantu Anda.
            </span>
          ) : (
            <span>
              Silakan pilih poliklinik lain yang masih buka, atau konsultasikan jadwal pendaftaran kepada{" "}
              <b>Petugas Informasi</b> di samping mesin kiosk ini.
            </span>
          )}
        </p>

        <button
          type="button"
          onClick={onKembali}
          autoFocus
          className="mt-8 flex h-20 w-full items-center justify-center gap-3 rounded-2xl bg-primary-dark text-2xl font-bold text-white shadow-lg active:scale-[0.99]"
        >
          <ArrowLeft className="size-8" /> KEMBALI PILIH POLI LAIN
        </button>
        <button
          type="button"
          onClick={onTanyaPetugas}
          className="mt-4 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-indigo-50 text-xl font-semibold text-ink active:scale-[0.99]"
        >
          <Headset className="size-7 text-accent-orange" /> Tanya Petugas Informasi Loket
        </button>
        <p className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-slate-600">
          <Loader className="size-5 animate-spin" /> Layar akan kembali otomatis ke daftar poli dalam {sisaDetik} detik
        </p>
      </div>
    </div>
  );
}

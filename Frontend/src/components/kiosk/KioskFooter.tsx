import { Asterisk, Pointer } from "lucide-react";

const KIOSK_ID = process.env.NEXT_PUBLIC_KIOSK_ID ?? "KSK-UMH-01";

/** Footer Kiosk: bantuan pelayanan dan ID perangkat kiosk (Figma Kiosk 1, 2, 4). */
export function KioskFooter() {
  return (
    <footer className="flex h-20 shrink-0 items-center justify-between gap-4 border-t border-line bg-surface px-6 xl:px-10">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-skipped-soft text-skipped">
          <Asterisk className="size-7" strokeWidth={3} />
        </span>
        <div>
          <p className="text-base font-bold xl:text-lg">Butuh Bantuan Pelayanan?</p>
          <p className="text-sm text-muted xl:text-base">Silakan hubungi petugas loket informasi di samping kiosk</p>
        </div>
      </div>
      <div className="hidden items-center gap-4 text-sm font-semibold text-muted md:flex">
        <span className="inline-flex items-center gap-1.5">
          <Pointer className="size-4" /> Sentuh Layar Untuk Memilih
        </span>
        <span className="h-6 w-px bg-line" />
        <span className="tracking-wider">KIOSK ID: {KIOSK_ID}</span>
      </div>
    </footer>
  );
}

"use client";

import { Clock, Printer } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useNow } from "@/hooks/useNow";
import { formatJam } from "@/lib/kiosk";
import { cn } from "@/lib/utils";

/** Header Kiosk: logo, status koneksi real-time, status printer, dan jam (Figma Kiosk 1–4). */
export function KioskHeader({ online }: { online: boolean }) {
  const now = useNow();
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-line bg-surface px-6 xl:h-24 xl:px-10">
      <Logo priority className="h-12 xl:h-16" />
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-bold shadow-sm xl:text-lg",
            online ? "text-primary-dark" : "text-skipped",
          )}
        >
          <span className={cn("size-3 rounded-full", online ? "bg-primary" : "bg-skipped animate-pulse")} />
          {online ? "ONLINE" : "OFFLINE"}
        </span>
        <span className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-bold text-primary-dark shadow-sm sm:inline-flex xl:text-lg">
          <Printer className="size-5" /> KERTAS SIAP
        </span>
        <span className="inline-flex min-w-28 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-base font-bold text-ink shadow-sm tabular-nums xl:text-lg">
          <Clock className="size-5 text-muted" />
          {now ? `${formatJam(now)} WIB` : "--:--"}
        </span>
      </div>
    </header>
  );
}

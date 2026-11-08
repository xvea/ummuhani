import type { QueueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Badge status antrian (SDD Bab 8) dengan warna dari Style Guide Figma bagian 2B.
 * Label memakai bahasa yang dipahami petugas dan pasien.
 */
const statusStyle: Record<QueueStatus, { label: string; className: string }> = {
  waiting: { label: "Menunggu", className: "bg-waiting-soft text-waiting" },
  called: { label: "Dipanggil", className: "bg-calling-soft text-calling" },
  done: { label: "Selesai", className: "bg-success-soft text-success" },
  skipped: { label: "Dilewati", className: "bg-skipped-soft text-skipped" },
};

export function StatusBadge({ status, className }: { status: QueueStatus; className?: string }) {
  const style = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        style.className,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {style.label}
    </span>
  );
}

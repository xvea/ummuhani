import { cn } from "@/lib/utils";

/**
 * Nomor antrian besar, contoh "A-033".
 * size "display" = Display TV (dibaca dari jauh), "lg" = Panel Loket, "md" = tabel/kartu kecil.
 */
const sizeClass = {
  display: "text-[8rem] leading-none md:text-[10rem]",
  lg: "text-6xl",
  md: "text-3xl",
} as const;

export function QueueNumber({
  value,
  size = "lg",
  className,
}: {
  value: string;
  size?: keyof typeof sizeClass;
  className?: string;
}) {
  return (
    <span className={cn("font-extrabold tracking-tight text-primary-dark tabular-nums", sizeClass[size], className)}>
      {value}
    </span>
  );
}

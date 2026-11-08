import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Kartu putih dengan sudut membulat, dipakai hampir di semua halaman Figma. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-line bg-white p-6 shadow-sm", className)}
      {...props}
    />
  );
}

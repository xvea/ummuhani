import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo RS Ummu Hani (public/logo-ummuhani.png).
 * Catatan: gambar sementara diambil dari ekspor Figma. Ganti dengan file logo
 * asli (PNG/SVG resolusi tinggi) dari pihak RS bila sudah tersedia.
 */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-ummuhani.png"
      alt="Logo RS Ummu Hani"
      width={312}
      height={134}
      priority={priority}
      className={cn("h-12 w-auto", className)}
    />
  );
}

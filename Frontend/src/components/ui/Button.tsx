import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Tombol sesuai Style Guide Figma (bagian 4A Button States & Variants):
 * - primary : "Panggil Nomor Berikutnya" (hijau)
 * - outline : "Panggil Ulang (Recall)" (putih, garis hijau)
 * - danger  : "Lewati (Skip)" (merah lembut)
 * - neutral : "Kembali" (abu)
 * Ukuran "xl" untuk Kiosk layar sentuh (huruf dan area sentuh besar).
 */
type Variant = "primary" | "outline" | "danger" | "neutral";
type Size = "md" | "lg" | "xl";

const variantClass: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline: "border-2 border-primary bg-white text-primary hover:bg-primary-soft",
  danger: "bg-skipped-soft text-skipped hover:bg-red-200",
  neutral: "bg-slate-100 text-ink hover:bg-slate-200",
};

const sizeClass: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-20 px-8 text-2xl",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}

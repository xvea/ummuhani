import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo RS Ummu Hani (public/logo-ummuhani.png, ekspor Figma "Logo RS Ummu Hani"). */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-ummuhani.png"
      alt="Logo RS Ummu Hani"
      width={491}
      height={222}
      priority={priority}
      className={cn("h-12 w-auto", className)}
    />
  );
}

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

/** Halaman sementara untuk route yang belum dibangun. */
export function ComingSoon({ title, acuan }: { title: string; acuan: string }) {
  return (
    <main className="bg-medical-gradient flex flex-1 items-center justify-center p-6">
      <Card className="flex w-full max-w-lg flex-col items-center gap-4 text-center">
        <Logo priority />
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted">Halaman ini akan dibangun sesuai desain Figma.</p>
        <p className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
          Acuan: {acuan}
        </p>
        <Link href="/" className="text-sm font-semibold text-medical underline">
          Kembali ke daftar halaman
        </Link>
      </Card>
    </main>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Font dari Style Guide Figma. next/font menyimpan file font saat build,
// jadi tetap tampil walau jaringan RS tidak punya internet.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Antrian RS Ummu Hani",
  description: "Sistem antrian real-time RS Ummu Hani Purbalingga",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}

import { formatJam, type Tiket } from "@/lib/kiosk";
import { ALAMAT_RS } from "./TiketTercetak";

/**
 * Tata letak tiket untuk printer thermal 58 mm (Figma "Tiket Kiosk Mandiri").
 * Hanya muncul saat dicetak (window.print). Di layar disembunyikan.
 */
export function TicketPrint({ tiket }: { tiket: Tiket }) {
  const waktu = new Date(tiket.waktu);
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(waktu);

  return (
    <div className="hidden w-[58mm] p-[3mm] font-mono text-[10px] leading-tight text-black print:block">
      <p className="text-center text-[12px] font-bold">RS UMMU HANI</p>
      <p className="text-center font-bold">PURBALINGGA</p>
      <p className="text-center text-[8px]">{ALAMAT_RS}</p>
      <hr className="my-2 border-dashed border-black" />
      <p className="text-center text-[8px] tracking-widest">NOMOR ANTREAN</p>
      <p className="text-center text-[36px] leading-none font-extrabold">{tiket.nomor}</p>
      <p className="mx-auto mt-1 w-fit bg-black px-2 py-0.5 text-[9px] font-bold text-white">
        [ {tiket.jenis === "BPJS" ? "BPJS KESEHATAN" : "UMUM"} ]
      </p>
      <hr className="my-2 border-black" />
      <p className="text-center font-bold uppercase">{tiket.poliNama}</p>
      <div className="mt-1 flex justify-between">
        <span>Waktu Cetak:</span>
        <span className="font-bold">
          {tanggal} {formatJam(waktu)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Sisa Antrean:</span>
        <span className="font-bold">{tiket.sisaAntrian} di depan</span>
      </div>
      <hr className="my-2 border-dashed border-black" />
      <p className="text-center font-bold">SILAKAN MENUNGGU PANGGILAN KE LOKET PENDAFTARAN</p>
      <p className="mt-2 text-center text-[8px]">Terima kasih atas kunjungan Anda. Semoga lekas sembuh.</p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { KioskFooter } from "@/components/kiosk/KioskFooter";
import { KioskHeader } from "@/components/kiosk/KioskHeader";
import { PilihJenis } from "@/components/kiosk/PilihJenis";
import { PilihPoli } from "@/components/kiosk/PilihPoli";
import { PoliTutupModal } from "@/components/kiosk/PoliTutupModal";
import { TicketPrint } from "@/components/kiosk/TicketPrint";
import { TiketTercetak } from "@/components/kiosk/TiketTercetak";
import { useCountdown } from "@/hooks/useCountdown";
import { ApiError } from "@/lib/api";
import { ambilTiket, fetchKioskData, type JenisPasien, type KioskData, type KioskPoli, type Tiket } from "@/lib/kiosk";
import { getSocket } from "@/lib/socket";

/** Lama layar menunggu sebelum kembali otomatis (detik). */
const BATAS_TIKET = 15;
const BATAS_TUTUP = 30;
const BATAS_DIAM_PILIH_POLI = 60;
const AUTO_PRINT = process.env.NEXT_PUBLIC_KIOSK_AUTO_PRINT === "true";

type Step = "jenis" | "poli" | "tiket";

/**
 * Aplikasi Kiosk (FR-02, Activity Diagram "Mengambil nomor antrian").
 * Alur: pilih BPJS/UMUM → pilih poli (cek buka/tutup) → tiket tercetak.
 * Poli tutup → peringatan (alur alternatif). Status poli diperbarui real-time lewat Socket.io.
 */
export function KioskApp({ initialData, initialError }: { initialData: KioskData; initialError: boolean }) {
  const [data, setData] = useState(initialData);
  const [loadError, setLoadError] = useState(initialError);
  const [online, setOnline] = useState(false);
  const [step, setStep] = useState<Step>("jenis");
  const [jenis, setJenis] = useState<JenisPasien>("BPJS");
  const [tiket, setTiket] = useState<Tiket | null>(null);
  const [poliTutup, setPoliTutup] = useState<KioskPoli | null>(null);
  const [infoPetugas, setInfoPetugas] = useState(false);
  const [submittingKode, setSubmittingKode] = useState<string | null>(null);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [aktivitas, setAktivitas] = useState(0); // berubah setiap layar disentuh (reset timer diam)

  const refresh = useCallback(async () => {
    try {
      setData(await fetchKioskData());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  // Real-time: perubahan buka/tutup poli dan jumlah antrian (FR-02, FR-06)
  useEffect(() => {
    const socket = getSocket();
    const onConnect = () => {
      setOnline(true);
      socket.emit("join:kiosk");
      void refresh();
    };
    const onDisconnect = () => setOnline(false);
    const onChange = () => void refresh();
    if (socket.connected) onConnect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("poli:update", onChange);
    socket.on("queue:update", onChange);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("poli:update", onChange);
      socket.off("queue:update", onChange);
    };
  }, [refresh]);

  const kembaliKeAwal = useCallback(() => {
    setStep("jenis");
    setTiket(null);
    setPoliTutup(null);
    setInfoPetugas(false);
    setPesanError(null);
  }, []);

  // Cetak tiket otomatis (aktifkan NEXT_PUBLIC_KIOSK_AUTO_PRINT=true di perangkat kiosk)
  useEffect(() => {
    if (tiket && AUTO_PRINT) {
      const id = setTimeout(() => window.print(), 400);
      return () => clearTimeout(id);
    }
  }, [tiket]);

  const pilihJenis = (value: JenisPasien) => {
    setJenis(value);
    setStep("poli");
    void refresh();
  };

  const pilihPoli = async (poli: KioskPoli) => {
    setPesanError(null);
    if (!poli.buka) {
      setPoliTutup(poli);
      return;
    }
    setSubmittingKode(poli.kode);
    try {
      const baru = await ambilTiket(poli, jenis);
      setTiket(baru);
      setStep("tiket");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Poli baru saja ditutup Admin saat pasien memilih
        setPoliTutup({ ...poli, buka: false });
        void refresh();
      } else {
        setPesanError(
          error instanceof ApiError ? error.message : "Tiket gagal dicetak. Silakan hubungi Petugas Informasi.",
        );
      }
    } finally {
      setSubmittingKode(null);
    }
  };

  // Hitung mundur: layar tiket, peringatan poli tutup, dan diam di layar pilih poli
  const sisaTiket = useCountdown(BATAS_TIKET, () => step === "tiket" && kembaliKeAwal(), `${step}-${tiket?.nomor}`);
  const sisaTutup = useCountdown(BATAS_TUTUP, () => poliTutup && setPoliTutup(null), poliTutup?.kode ?? "none");
  useCountdown(BATAS_DIAM_PILIH_POLI, () => step === "poli" && !poliTutup && kembaliKeAwal(), `${step}-${aktivitas}`);

  return (
    <>
      <div
        className="bg-medical-gradient flex h-dvh flex-col overflow-hidden select-none print:hidden"
        onPointerDown={() => setAktivitas((n) => n + 1)}
      >
        <KioskHeader online={online} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {step === "jenis" && <PilihJenis totalMenunggu={data.totalMenunggu} onPilih={pilihJenis} />}
          {step === "poli" && (
            <PilihPoli
              jenis={jenis}
              polies={data.polies}
              loadError={loadError}
              submittingKode={submittingKode}
              onBack={kembaliKeAwal}
              onPilih={pilihPoli}
            />
          )}
          {step === "tiket" && tiket && (
            <TiketTercetak tiket={tiket} sisaDetik={sisaTiket} totalDetik={BATAS_TIKET} onSelesai={kembaliKeAwal} />
          )}
        </main>
        {step !== "tiket" && <KioskFooter />}

        {pesanError && (
          <div role="alert" className="fixed inset-x-6 bottom-24 z-40 mx-auto max-w-2xl rounded-2xl bg-skipped p-5 text-center text-xl font-semibold text-white shadow-xl">
            {pesanError}
          </div>
        )}

        {poliTutup && (
          <PoliTutupModal
            poli={poliTutup}
            sisaDetik={sisaTutup}
            infoPetugas={infoPetugas}
            onKembali={() => {
              setPoliTutup(null);
              setInfoPetugas(false);
            }}
            onTanyaPetugas={() => setInfoPetugas(true)}
          />
        )}
      </div>

      {tiket && <TicketPrint tiket={tiket} />}
    </>
  );
}

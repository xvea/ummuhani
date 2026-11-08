'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function KioskWelcomePage() {
  const router = useRouter()
  const [antrianCount, setAntrianCount] = useState({
    bpjs: 0,
    umum: 0,
  })

  useEffect(() => {
    const fetchAntrianSummary = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/antrian/display')
        const polies = res.data?.data?.polies || res.data?.polies || []

        const total = polies.reduce(
          (acc, item) => ({
            bpjs: acc.bpjs + (Number(item.totalBpjs) || 0),
            umum: acc.umum + (Number(item.totalUmum) || 0),
          }),
          { bpjs: 0, umum: 0 }
        )

        setAntrianCount(total)
      } catch (error) {
        console.error('Gagal memuat total antrian:', error)
      }
    }

    fetchAntrianSummary()

    const interval = setInterval(fetchAntrianSummary, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen w-full flex-col justify-between overflow-hidden bg-[url('/bg1.png')] bg-cover bg-no-repeat font-sans select-none">
      <header className="z-10 flex w-full shrink-0 items-center justify-between bg-white px-10 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo RS Ummu Hani" height={75} width={100} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-center justify-center overflow-y-auto px-10 pt-10 pb-14">
        <div className="mb-9 text-center">
          <h1 className="text-[40px] leading-tight font-black tracking-tight text-[#111C2D] uppercase md:text-[48px]">
            SELAMAT DATANG DI <span className="text-[#0D631B]">RS UMMU HANI</span>
          </h1>
          <p className="mt-2 text-base font-medium text-[#334155] md:text-lg">
            Sentuh jenis penjaminan untuk mengambil nomor tiket antrian pendaftaran
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div
            className="relative flex overflow-hidden rounded-[28px] border border-[#BFCABA]/40 shadow-[0_12px_32px_rgba(0,34,4,0.06)]"
            style={{
              background:
                'radial-gradient(circle at 85% 20%, rgba(163, 246, 156, 0.3) 0%, rgba(255, 255, 255, 0.95) 70%)',
            }}
          >
            <div className="w-3.5 shrink-0 bg-[#0D631B]" />

            <div className="flex flex-1 flex-col justify-between p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-[#A3F69C] p-3.5 shadow-sm">
                  <svg
                    className="h-8 w-8 text-[#002204]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-[#40493D] px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase">
                  <svg
                    className="h-4 w-4 text-[#A3F69C]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  JKN / KIS
                </span>
              </div>

              <div className="mb-7 text-left">
                <h2 className="text-3xl font-extrabold tracking-tight text-[#0D631B] uppercase md:text-4xl">
                  PASIEN BPJS
                </h2>
                <p className="mt-1.5 text-sm font-medium text-[#334155] md:text-base">
                  Membawa Kartu BPJS / KTP / Rujukan Faskes Tingkat 1
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/kiosk/daftar?jenis=bpjs')}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[#0D631B] px-7 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#002204] active:scale-[0.99] md:text-lg"
              >
                <span>Tekan Disini</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="relative flex overflow-hidden rounded-[28px] border border-[#BFCABA]/40 shadow-[0_12px_32px_rgba(0,29,49,0.06)]"
            style={{
              background:
                'radial-gradient(circle at 85% 20%, rgba(204, 229, 255, 0.4) 0%, rgba(255, 255, 255, 0.95) 70%)',
            }}
          >
            <div className="w-3.5 shrink-0 bg-[#005A8A]" />

            <div className="flex flex-1 flex-col justify-between p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-[#CCE2F8] p-3.5 shadow-sm">
                  <svg
                    className="h-8 w-8 text-[#001D31]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-[#0074B0] px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase">
                  <svg
                    className="h-4 w-4 text-[#CCE5FF]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                  </svg>
                  NON-BPJS
                </span>
              </div>

              <div className="mb-7 text-left">
                <h2 className="text-3xl font-extrabold tracking-tight text-[#005A8A] uppercase md:text-4xl">
                  PASIEN UMUM
                </h2>
                <p className="mt-1.5 text-sm font-medium text-[#334155] md:text-base">
                  Pembayaran Mandiri, Tunai/Debit, atau Asuransi Rekanan
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/kiosk/daftar?jenis=umum')}
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-[#005A8A] px-7 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-[#001D31] active:scale-[0.99] md:text-lg"
              >
                <span>Tekan Disini</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ================= BAR PETUNJUK BERKAS & INFO ANTRIAN ================= */}
        <div className="mt-7 flex w-full flex-col items-center justify-between gap-4 rounded-2xl border border-white/90 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md md:flex-row">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FC820C]/20 text-[#964900]">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="M15 8h2" />
                <path d="M15 12h2" />
                <path d="M7 16h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111C2D]">Petunjuk Berkas</h3>
              <p className="mt-0.5 text-xs font-medium text-[#334155]">
                Harap siapkan KTP asli &amp; surat rujukan (jika ada) sebelum menuju loket pendaftaran
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-7 text-xs font-medium text-[#334155]">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#0D631B]" />
              <span>
                Antrian BPJS: <strong className="font-extrabold text-[#111C2D]">{antrianCount.bpjs} Org</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-[#005A8A]" />
              <span>
                Antrian Umum: <strong className="font-extrabold text-[#111C2D]">{antrianCount.umum} Org</strong>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER KIOSK ================= */}
      <footer className="z-10 flex w-full shrink-0 items-center justify-between border-t border-[#BFCABA]/30 bg-white/90 px-10 py-4 text-xs text-[#334155]">
        <div className="flex items-center gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFDAD6] text-lg font-black text-[#93000A]">
            *
          </div>
          <div>
            <p className="text-xs font-bold text-[#111C2D]">Butuh Bantuan Pelayanan?</p>
            <p className="text-[11px] text-[#334155]">Silakan hubungi petugas loket informasi di samping kiosk</p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs font-medium text-[#334155]">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-[#334155]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
            Sentuh Layar Untuk Memilih
          </span>
          <span className="h-4 w-[1px] bg-[#BFCABA]" />
          <span className="font-bold tracking-wide text-[#334155]">KIOSK ID: KSK-UMH-01</span>
        </div>
      </footer>
    </div>
  )
}

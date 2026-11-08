'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Suspense, useEffect, useState } from 'react'

function getPoliIcon(namaPoli = '', isOpen = true) {
  const name = namaPoli.toLowerCase()
  const colorClass = isOpen ? 'text-[#0D631B]' : 'text-[#334155]/50'

  if (name.includes('anak')) {
    return (
      <svg
        className={`h-6 w-6 ${colorClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
        <path d="M12 2a3 3 0 0 0 0 6" />
      </svg>
    )
  }
  if (name.includes('gigi') || name.includes('mulut')) {
    return (
      <svg
        className={`h-6 w-6 ${colorClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3C4.2 3 2 5.2 2 8c0 2.8 1.5 5.2 3 7.5 1.1 1.7 2 4.5 3 4.5s1.5-2 2.5-2h3c1 0 1.5 2 2.5 2s1.9-2.8 3-4.5C20.5 13.2 22 10.8 22 8c0-2.8-2.2-5-5-5-1.9 0-3.5 1-5 1S8.9 3 7 3z" />
      </svg>
    )
  }
  if (name.includes('kandungan') || name.includes('obgyn') || name.includes('kebidanan')) {
    return (
      <svg
        className={`h-6 w-6 ${colorClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="2" />
        <path d="M10 9h4l2 6h-2v6h-4v-6H8l2-6z" />
      </svg>
    )
  }
  if (name.includes('mata')) {
    return (
      <svg
        className={`h-6 w-6 ${colorClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  if (name.includes('bedah')) {
    return (
      <svg
        className={`h-6 w-6 ${colorClass}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="12" y1="10" x2="12" y2="16" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    )
  }
  return (
    <svg
      className={`h-6 w-6 ${colorClass}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v8" />
      <path d="M6.8 6C4 7.5 2 11 2 15c0 3.3 2.7 6 6 6 2.2 0 4-1.8 4-4v-5" />
      <path d="M17.2 6C20 7.5 22 11 22 15c0 3.3-2.7 6-6 6-2.2 0-4-1.8-4-4v-5" />
    </svg>
  )
}

function PilihPoliContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawJenis = (searchParams.get('jenis') || 'bpjs').toLowerCase()
  const isBpjs = rawJenis === 'bpjs'

  const [poliList, setPoliList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      setCurrentTime(`${timeStr.replace('.', ':')} WIB`)
    }

    updateClock()
    const timer = setInterval(updateClock, 10000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchAllPoli = async () => {
      setLoading(true)
      try {
        const res = await axios.get('http://localhost:3001/api/poli')
        const rawData = res.data?.data || res.data || []

        const sorted = [...rawData].sort((a, b) => {
          const openA = a.aktifonline === 1 || a.aktifonline === true ? 1 : 0
          const openB = b.aktifonline === 1 || b.aktifonline === true ? 1 : 0
          if (openB !== openA) return openB - openA
          return (a.poli || '').localeCompare(b.poli || '')
        })

        setPoliList(sorted)
      } catch (err) {
        console.error('Gagal mengambil daftar poliklinik:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPoli()
  }, [])

  const totalOpenPoli = poliList.filter((p) => p.aktifonline === 1 || p.aktifonline === true).length

  const handleSelectPoli = (poli) => {
    const isOpen = poli.aktifonline === 1 || poli.aktifonline === true
    if (!isOpen) return
    console.log('Poli dipilih:', {
      jenisPasien: isBpjs ? 'BPJS' : 'Umum',
      kode_poli: poli.kode_poli,
      nama_poli: poli.poli,
    })
  }

  return (
    <div className="flex h-screen w-full flex-col justify-between overflow-hidden bg-[url('/bg1.png')] bg-cover bg-no-repeat font-sans select-none">
      <header className="z-20 flex w-full shrink-0 items-center justify-between bg-white px-10 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo RS Ummu Hani" height={75} width={100} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-between overflow-hidden px-10 py-6">
        {/* Bagian Atas: Navigasi Kembali, Kategori Registrasi, & Judul */}
        <div className="shrink-0">
          {/* Baris 1: Tombol Kembali & Badge Kategori Registrasi */}
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/kiosk')}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white bg-white px-6 py-3.5 text-sm font-extrabold tracking-wide text-[#111C2D] shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              <svg className="h-5 w-5 text-[#111C2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              KEMBALI
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#334155]">Kategori Registrasi:</span>

              {/* Badge Dinamis: Hijau untuk BPJS, Biru untuk Umum */}
              <div
                className={`flex items-center gap-3 rounded-full px-5 py-2.5 text-white shadow-sm ${
                  isBpjs ? 'bg-[#2E7D32]' : 'bg-[#005A8A]'
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-4 w-4 text-white"
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
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[9px] font-bold tracking-widest uppercase opacity-85">JENIS PASIEN</span>
                  <span className="block text-sm font-extrabold tracking-wide uppercase">
                    {isBpjs ? 'BPJS KESEHATAN' : 'PASIEN UMUM'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Baris 2: Judul Halaman & Indikator Loket Buka + Jam WIB */}
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl leading-none font-black tracking-tight text-[#111C2D] uppercase md:text-[34px]">
                PILIH POLIKLINIK TUJUAN
              </h1>
              <p className="mt-1.5 text-sm font-medium text-[#334155] md:text-base">
                Sentuh salah satu kartu poliklinik aktif di bawah untuk melanjutkan cetak antrian.
              </p>
            </div>

            {/* Pill Loket Buka & Jam */}
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white bg-white/95 px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-[#0D631B] uppercase">
                <svg
                  className="h-4 w-4 text-[#0D631B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                </svg>
                <span>LOKET BUKA: {totalOpenPoli} POLI</span>
              </div>
              <span className="h-4 w-[1px] bg-[#BFCABA]/60" />
              <span className="text-sm font-black text-[#111C2D]">{currentTime || '--:-- WIB'}</span>
            </div>
          </div>
        </div>

        {/* ================= AREA GRID POLIKLINIK (SCROLLABLE JIKA > 6 POLI) ================= */}
        <div className="my-1 max-h-[450px] flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-[205px] animate-pulse rounded-[24px] border border-white/80 bg-white/60 p-6"
                />
              ))}
            </div>
          ) : poliList.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-3xl border border-white bg-white/75 p-10 text-center">
              <p className="text-base font-bold text-[#334155]">Belum ada data poliklinik yang terdaftar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 pb-2 md:grid-cols-3">
              {poliList.map((poli) => {
                const isOpen = poli.aktifonline === 1 || poli.aktifonline === true

                return (
                  <div
                    key={poli.kode_poli}
                    onClick={() => handleSelectPoli(poli)}
                    className={`relative flex h-[205px] overflow-hidden rounded-[24px] transition-all ${
                      isOpen
                        ? 'cursor-pointer border border-white bg-white/95 shadow-[0_8px_24px_rgba(17,28,45,0.05)] hover:bg-white hover:shadow-md active:scale-[0.99]'
                        : 'cursor-not-allowed border border-white/60 bg-[#CCE2F8]/55 opacity-85'
                    }`}
                  >
                    {/* Strip Vertikal Kiri (Hijau saat Buka, Abu/Biru saat Tutup) */}
                    <div
                      className={`my-5 w-2 shrink-0 rounded-r-full ${isOpen ? 'bg-[#0D631B]' : 'bg-[#8BBDE7]/60'}`}
                    />

                    <div className="flex flex-1 flex-col justify-between p-5">
                      {/* Baris Atas: Icon Poli & Badge BUKA / TUTUP */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isOpen ? 'bg-[#BFCABA]/30' : 'bg-white/50'
                          }`}
                        >
                          {getPoliIcon(poli.poli, isOpen)}
                        </div>

                        {isOpen ? (
                          <span className="flex items-center gap-1.5 rounded-full bg-[#A3F69C]/40 px-3 py-1 text-[11px] font-extrabold tracking-wider text-[#0D631B] uppercase">
                            <span className="h-2 w-2 rounded-full bg-[#0D631B]" />
                            BUKA
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 rounded-full bg-[#FFDAD6] px-3 py-1 text-[11px] font-extrabold tracking-wider text-[#93000A] uppercase">
                            <span className="h-2 w-2 rounded-full bg-[#93000A]" />
                            TUTUP
                          </span>
                        )}
                      </div>

                      {/* Tengah: Nama Poliklinik & Deskripsi */}
                      <div className="my-1 text-left">
                        <h2
                          className={`line-clamp-1 text-lg leading-snug font-extrabold tracking-tight ${
                            isOpen ? 'text-[#111C2D]' : 'text-[#334155]/75'
                          }`}
                        >
                          {poli.poli}
                        </h2>
                        <p
                          className={`mt-0.5 line-clamp-2 text-xs leading-relaxed font-medium ${
                            isOpen ? 'text-[#334155]' : 'text-[#334155]/65'
                          }`}
                        >
                          {poli.deskripsi || `Layanan pemeriksaan dan konsultasi ${poli.poli}`}
                        </p>
                      </div>

                      {/* Baris Bawah: Info Dokter / Status Ketersediaan */}
                      {isOpen ? (
                        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/90 px-3.5 py-2 text-xs">
                          <div className="flex items-center gap-2 truncate font-bold text-[#111C2D]">
                            <svg
                              className="h-4 w-4 shrink-0 text-[#0D631B]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                              <circle cx="20" cy="10" r="2" />
                            </svg>
                            <span className="truncate">{poli.namadokter || `Dokter ${poli.poli}`}</span>
                          </div>
                          <span className="ml-2 shrink-0 text-[11px] font-extrabold text-[#0D631B]">Tersedia</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/40 px-3.5 py-2 text-xs font-bold text-[#334155]/75">
                          <svg
                            className="h-4 w-4 shrink-0 text-[#334155]/60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="truncate">{poli.keterangan_tutup || 'Jadwal Praktek Sedang Tutup'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ================= BANNER INFORMASI BAWAH ================= */}
        <div className="mt-4 flex w-full shrink-0 items-center gap-3.5 rounded-2xl border border-white bg-white/90 px-6 py-3.5 shadow-sm backdrop-blur-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CCE2F8] text-[#001D31]">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#334155] md:text-sm">
            Jika poli tujuan tidak terdaftar atau tutup, hubungi{' '}
            <strong className="font-extrabold text-[#0D631B]">Petugas Informasi RS Ummu Hani.</strong>
          </p>
        </div>
      </main>

      {/* ================= FOOTER KIOSK (STICKY / FIXED DI BAWAH) ================= */}
      <footer className="z-20 flex w-full shrink-0 items-center justify-between border-t border-[#BFCABA]/30 bg-white/90 px-10 py-4 text-xs text-[#334155]">
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

export default function KioskPilihPoliPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#CCE2F8]" />}>
      <PilihPoliContent />
    </Suspense>
  )
}

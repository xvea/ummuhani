'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('petugas')
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        login: loginInput,
        password: password,
      })

      const { token, user } = response.data.data

      if (user.grupuser !== activeTab) {
        setErrorMessage(
          `Akun Anda terdaftar sebagai ${user.grupuser.toUpperCase()}, bukan ${
            activeTab === 'admin' ? 'Administrator' : 'Petugas Loket'
          }.`
        )
        setLoading(false)
        return
      }

      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8
      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `user_role=${user.grupuser}; path=/; max-age=${maxAge}; SameSite=Lax`
      localStorage.setItem('user_info', JSON.stringify(user))

      if (user.grupuser === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/petugas')
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message)
      } else {
        setErrorMessage('Username atau password tidak sesuai. Silakan periksa kembali kredensial Anda.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[url('/bg1.png')] bg-cover bg-no-repeat p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <img src="/logo.svg" alt="Logo RS Ummu Hani" height={75} width={100} />
        <span className="text-xs font-semibold tracking-widest text-emerald-800 uppercase">Rumah Sakit Umum</span>
        <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-800">SISTEM ANTRIAN</h1>
        <p className="text-xs font-medium text-slate-500">Portal Masuk Petugas Loket &amp; Administrator</p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-slate-800">Masuk untuk Memulai Sesi Anda</h2>
          <p className="mt-0.5 text-xs text-slate-400">Gunakan identitas dinas yang terdaftar pada SIMRS</p>
        </div>

        <div className="mb-6 flex gap-1 rounded-xl border border-slate-200/60 bg-slate-100/80 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('petugas')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'petugas' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Petugas Loket
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'admin' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Username / NIP {activeTab === 'admin' ? 'Admin' : 'Petugas'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Masukkan Username / NIP"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <a href="#lupa-password" className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700">
                Lupa Password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="focus:ring-emerald-500accent-emerald-600 h-4 w-4 rounded border-slate-300 text-emerald-600"
              />
              <span className="text-xs font-medium text-slate-600">Ingat perangkat loket ini</span>
            </label>
            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              Loket Aktif: #01
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition duration-150 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70"
          >
            {loading ? 'Memproses...' : 'Sign In'}
            {!loading && (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="animate-in fade-in mt-5 flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/90 p-3.5 text-red-700 duration-200">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <span className="block text-xs font-bold text-red-800">Login Gagal:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed text-red-600">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage('')} className="p-0.5 text-red-400 hover:text-red-600">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = request.nextUrl

  // Rute Publik (bebas diakses siapapun)
  const publicRoutes = ['/', '/kiosk', '/login', '/display']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Mengambil token dan role dari cookie
  const token = request.cookies.get('auth_token')?.value
  const role = request.cookies.get('user_role')?.value

  // Verifikasi akses untuk rute /dashboard/admin
  if (pathname.startsWith('/dashboard/admin')) {
    if (!token || role !== 'admin') {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Verifikasi akses untuk rute /dashboard/petugas
  if (pathname.startsWith('/dashboard/petugas')) {
    if (!token || role !== 'petugas') {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match semua rute kecuali file statis (_next, favicon, assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

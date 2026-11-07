import { env } from '../config/env.js';
import { AppError } from '../utils/http.js';
import { validasiToken } from '../services/auth.service.js';

function cookieToken(header, cookieName) {
  if (!header) return null;
  for (const item of header.split(';')) {
    const index = item.indexOf('=');
    if (index < 0) continue;
    const key = item.slice(0, index).trim();
    if (key === cookieName) return decodeURIComponent(item.slice(index + 1).trim());
  }
  return null;
}

export async function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : cookieToken(req.headers.cookie, env.cookieName);
    if (!token) throw new AppError(401, 'Token autentikasi diperlukan');

    const user = await validasiToken(token);

    req.user = {
      login: user.login,
      grupuser: user.grupuser,
      namalengkap: user.namalengkap,
      poli: user.poli
    };
    req.accessToken = token;
    return next();
  } catch (error) {
    return next(error instanceof AppError ? error : new AppError(401, 'Token tidak valid atau sudah berakhir'));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.grupuser)) return next(new AppError(403, 'Anda tidak memiliki hak akses untuk operasi ini'));
    next();
  };
}

export const requireAdmin = authorize('admin');
export const requirePetugas = authorize('petugas');

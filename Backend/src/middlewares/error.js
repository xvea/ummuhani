import { Prisma } from '@prisma/client';
import { fail } from '../utils/http.js';

export function notFound(req, _res, next) {
  next({ status: 404, message: `Route ${req.method} ${req.originalUrl} tidak ditemukan` });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return fail(res, 'Data dengan nilai unik tersebut sudah ada', 409);
    if (error.code === 'P2025') return fail(res, 'Data tidak ditemukan', 404);
    if (error.code === 'P2003' || error.code === 'P2014') return fail(res, 'Data masih memiliki relasi sehingga tidak dapat dihapus', 409);
    if (error.code === 'P2034') return fail(res, 'Konflik transaksi, silakan ulangi permintaan', 409);
  }
  if (error?.type === 'entity.parse.failed') return fail(res, 'JSON request body tidak valid', 400);
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  return fail(res, status >= 500 ? 'Terjadi kesalahan internal server' : (error.message || 'Request gagal'), status, error.details);
}

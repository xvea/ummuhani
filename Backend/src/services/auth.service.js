import { hashPassword, comparePassword } from '../utils/password.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/http.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

const ALLOWED_ROLES = new Set(['admin', 'petugas']);

function publicUser(user) {
  return { login: user.login, namalengkap: user.namalengkap, grupuser: user.grupuser, poli: user.poli ?? null };
}

export async function login(login, password) {
  const user = await prisma.user.findUnique({ where: { login } });
  // Return the same credential error regardless of whether the login exists.
  if (!user || !(await comparePassword(password, user.password))) throw new AppError(401, 'Login Gagal');
  if (!ALLOWED_ROLES.has(user.grupuser)) throw new AppError(403, 'Role pengguna tidak diizinkan');

  const token = generateToken(user);
  await prisma.user.update({ where: { login }, data: { token } });
  return { token, tokenType: 'Bearer', expiresIn: '8h', user: publicUser(user) };
}

export async function validasiToken(token) {
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError(401, 'Token tidak valid atau sudah kedaluwarsa');
  }
  const user = await prisma.user.findUnique({ where: { login: payload.login } });
  if (!user || !user.token || user.token !== token) throw new AppError(401, 'Sesi tidak valid atau sudah berakhir');
  return user;
}

export async function logout(login) {
  await prisma.user.update({ where: { login }, data: { token: null } });
  return { message: 'Logout berhasil' };
}

export async function getMe(login) {
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user) throw new AppError(404, 'Pengguna tidak ditemukan');
  return publicUser(user);
}

export async function listStaff() {
  return prisma.user.findMany({
    where: { grupuser: 'petugas' },
    select: { login: true, namalengkap: true, grupuser: true, poli: true },
    orderBy: { namalengkap: 'asc' }
  });
}

async function validateAssignedPoli(poli) {
  if (!poli) return null;
  const codes = [String(poli).trim().toUpperCase()].filter(Boolean);
  if (codes.length && codes[0].length > 20) throw new AppError(400, 'Kode poli maksimal 20 karakter');
  const rows = await prisma.poli.findMany({ where: { kode_poli: { in: codes } }, select: { kode_poli: true } });
  const found = new Set(rows.map((row) => row.kode_poli));
  const invalid = codes.filter((code) => !found.has(code));
  if (invalid.length) throw new AppError(400, 'Poli penugasan tidak ditemukan', { poli: invalid });
  return codes.join(',');
}

export async function createStaff(data) {
  if (typeof data.login !== 'string' || !data.login.trim() || data.login.trim().length > 50) throw new AppError(400, 'login wajib diisi dan maksimal 50 karakter');
  if (typeof data.namalengkap !== 'string' || !data.namalengkap.trim() || data.namalengkap.trim().length > 50) throw new AppError(400, 'namalengkap wajib diisi dan maksimal 50 karakter');
  if (typeof data.password !== 'string' || data.password.length < 8) throw new AppError(400, 'Password minimal 8 karakter');
  const poli = await validateAssignedPoli(data.poli ?? null);
  const password = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { login: data.login.trim(), password, namalengkap: data.namalengkap.trim(), poli, grupuser: 'petugas', token: null },
    select: { login: true, namalengkap: true, grupuser: true, poli: true }
  });
  return user;
}

export async function updateStaff(login, data) {
  const existing = await prisma.user.findUnique({ where: { login } });
  if (!existing) throw new AppError(404, 'Akun petugas tidak ditemukan');
  if (existing.grupuser !== 'petugas') throw new AppError(403, 'Hanya akun petugas yang dapat diperbarui melalui endpoint ini');

  const update = {};
  if (data.namalengkap !== undefined) {
    if (typeof data.namalengkap !== 'string' || !data.namalengkap.trim()) throw new AppError(400, 'namalengkap tidak boleh kosong');
    update.namalengkap = data.namalengkap.trim();
  }
  if (data.poli !== undefined) update.poli = await validateAssignedPoli(data.poli);
  if (data.namalengkap !== undefined && data.namalengkap.trim().length > 50) throw new AppError(400, 'namalengkap maksimal 50 karakter');
  if (data.password !== undefined && data.password !== '') {
    if (typeof data.password !== 'string' || data.password.length < 8) throw new AppError(400, 'Password baru minimal 8 karakter');
    update.password = await hashPassword(data.password);
    update.token = null; // revoke any existing session when credentials change
  }
  if (Object.keys(update).length === 0) throw new AppError(400, 'Tidak ada field yang diperbarui');

  return prisma.user.update({
    where: { login }, data: update,
    select: { login: true, namalengkap: true, grupuser: true, poli: true }
  });
}

export async function deleteStaff(login, actorLogin) {
  if (login === actorLogin) throw new AppError(409, 'Admin tidak dapat menghapus akun yang sedang digunakan');
  const existing = await prisma.user.findUnique({ where: { login }, select: { grupuser: true } });
  if (!existing) throw new AppError(404, 'Akun petugas tidak ditemukan');
  if (existing.grupuser !== 'petugas') throw new AppError(403, 'Endpoint ini hanya dapat menghapus akun petugas');
  await prisma.user.delete({ where: { login } });
  return { message: 'Akun petugas berhasil dihapus' };
}

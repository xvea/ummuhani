import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/http.js';
import { todayDate } from '../utils/date.js';

export async function listPoli({ onlyOpen = false } = {}) {
  return prisma.poli.findMany({
    where: onlyOpen ? { aktifonline: 1 } : undefined,
    orderBy: [{ poli: 'asc' }, { kode_poli: 'asc' }]
  });
}

export async function getPoli(kode) {
  return prisma.poli.findUnique({ where: { kode_poli: kode } });
}

export async function listAdminPoli() {
  const today = todayDate();
  const [polies, counts] = await prisma.$transaction([
    prisma.poli.findMany({ orderBy: [{ poli: 'asc' }, { kode_poli: 'asc' }] }),
    prisma.pendaftaran.groupBy({ by: ['poli'], where: { tanggalberobat: today }, _count: { _all: true } })
  ]);
  const countMap = new Map(counts.filter((row) => row.poli).map((row) => [row.poli, row._count._all]));
  return polies.map((poli) => ({ ...poli, jumlah_antrian_hari_ini: countMap.get(poli.kode_poli) ?? 0 }));
}

function validatePoli(data, { partial = false } = {}) {
  const errors = {};
  if (!partial || data.kode_poli !== undefined) {
    if (typeof data.kode_poli !== 'string' || !data.kode_poli.trim()) errors.kode_poli = 'wajib diisi';
    else if (data.kode_poli.trim().length > 20) errors.kode_poli = 'maksimal 20 karakter';
  }
  if (!partial || data.poli !== undefined) {
    if (typeof data.poli !== 'string' || !data.poli.trim()) errors.poli = 'wajib diisi';
    else if (data.poli.trim().length > 100) errors.poli = 'maksimal 100 karakter';
  }
  if (data.deskripsi !== undefined && data.deskripsi !== null && (typeof data.deskripsi !== 'string' || data.deskripsi.length > 150)) {
    errors.deskripsi = 'harus berupa string maksimal 150 karakter';
  }
  if (data.aktifonline !== undefined && ![0, 1, true, false].includes(data.aktifonline)) errors.aktifonline = 'harus bernilai 0 atau 1';
  if (Object.keys(errors).length) throw new AppError(400, 'Data poli tidak valid', { fields: errors });
}

export async function createPoli(data) {
  validatePoli(data);
  return prisma.poli.create({
    data: {
      kode_poli: data.kode_poli.trim().toUpperCase(),
      poli: data.poli.trim(),
      deskripsi: data.deskripsi?.trim() || null,
      aktifonline: data.aktifonline === undefined ? 1 : (data.aktifonline === true || data.aktifonline === 1 ? 1 : 0)
    }
  });
}

export async function updatePoli(kode, data) {
  validatePoli(data, { partial: true });
  const update = {};
  if (data.poli !== undefined) update.poli = data.poli.trim();
  if (data.deskripsi !== undefined) update.deskripsi = data.deskripsi?.trim() || null;
  if (data.aktifonline !== undefined) update.aktifonline = data.aktifonline === true || data.aktifonline === 1 ? 1 : 0;
  if (!Object.keys(update).length) throw new AppError(400, 'Tidak ada field yang diperbarui');
  return prisma.poli.update({ where: { kode_poli: kode }, data: update });
}

export async function setPoliStatus(kode, value) {
  if (![0, 1, true, false].includes(value)) throw new AppError(400, 'aktifonline harus bernilai 1 (buka) atau 0 (tutup)');
  return prisma.poli.update({ where: { kode_poli: kode }, data: { aktifonline: value === true || value === 1 ? 1 : 0 } });
}

export async function deletePoli(kode) {
  const related = await prisma.pendaftaran.count({ where: { poli: kode } });
  if (related > 0) throw new AppError(409, 'Poli masih memiliki histori pendaftaran dan tidak dapat dihapus');
  await prisma.poli.delete({ where: { kode_poli: kode } });
  return { message: 'Poli berhasil dihapus' };
}

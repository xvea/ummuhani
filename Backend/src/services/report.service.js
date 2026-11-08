import { prisma } from '../config/prisma.js';
import { dateFromQuery, jakartaDateString } from '../utils/date.js';
import { AppError } from '../utils/http.js';

function durationLabel(seconds) {
  if (seconds === null || seconds === undefined) return null;
  const total = Math.max(0, Number(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return mins ? `${mins} menit ${secs} detik` : `${secs} detik`;
}

export async function getReport({ tanggal, poli }) {
  const date = dateFromQuery(tanggal || jakartaDateString());
  if (poli !== undefined && poli !== null && typeof poli !== 'string') throw new AppError(400, 'Parameter poli tidak valid');
  const conditions = ['tanggalberobat = ?'];
  const params = [date];
  if (poli) { conditions.push('poli = ?'); params.push(poli.trim().toUpperCase()); }
  const rows = await prisma.$queryRawUnsafe(
    `SELECT * FROM vw_rekap_antrian_harian WHERE ${conditions.join(' AND ')} ORDER BY noantripoli ASC`,
    ...params
  );
  const data = rows.map((row) => ({
    ...row,
    durasi_tunggu_label: durationLabel(row.durasi_tunggu_detik),
    durasi_pelayanan_label: durationLabel(row.durasi_pelayanan_detik)
  }));
  const validDurasiTunggu = data.map((row) => row.durasi_tunggu_detik).filter((v) => v !== null && v !== undefined).map(Number);
  const validDurasiLayan = data.map((row) => row.durasi_pelayanan_detik).filter((v) => v !== null && v !== undefined).map(Number);
  const average = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
  return {
    filters: { tanggal: tanggal || jakartaDateString(), poli: poli || null },
    total: data.length,
    summary: {
      menunggu: data.filter((row) => row.status_pendaftaran === 'waiting').length,
      dipanggil: data.filter((row) => row.status_pendaftaran === 'called').length,
      dilewati: data.filter((row) => row.status_pendaftaran === 'skipped').length,
      selesai: data.filter((row) => row.status_pendaftaran === 'done').length,
      rata_rata_tunggu_detik: average(validDurasiTunggu),
      rata_rata_pelayanan_detik: average(validDurasiLayan)
    },
    rows: data
  };
}

import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/http.js';
import { dateFromQuery, todayDate, jakartaDateString } from '../utils/date.js';
import { QUEUE_STATUS, makeTicket, assertQueueStatus, isQueueStatus } from '../utils/queue-rules.js';
import { catatTask } from './task-antrian.service.js';

export { QUEUE_STATUS, makeTicket };

const queueInclude = {
  task: true,
  poliRef: { select: { kode_poli: true, poli: true, aktifonline: true, deskripsi: true } },
  pasien: { select: { norm: true, nama: true } },
  dokterRef: { select: { kodedokter: true, namadokter: true, spesialisasi: true, aktif: true } }
};

function assignedPolies(user) {
  return (user?.poli ?? '').split(',').map((value) => value.trim()).filter(Boolean);
}

function assertStaffOwnsPoli(user, poliCode) {
  if (user?.grupuser === 'admin') return;
  if (!assignedPolies(user).includes(poliCode)) throw new AppError(403, 'Petugas tidak ditugaskan pada poli tersebut');
}

function actionResult(queue, actionType) {
  return { queue, actionType };
}

async function fetchQueue(tiketreg, tanggalberobat) {
  const queue = await prisma.pendaftaran.findUnique({
    where: { tiketreg_tanggalberobat: { tiketreg, tanggalberobat } }, include: queueInclude
  });
  if (!queue) throw new AppError(404, 'Nomor antrian tidak ditemukan');
  return queue;
}

export async function createQueue({ poliCode, norm = null, dokter = null, jenisantrian = null, jamdatang = null }) {
  if (typeof poliCode !== 'string' || !poliCode.trim()) throw new AppError(400, 'poli wajib diisi');
  const code = poliCode.trim().toUpperCase();
  const poli = await prisma.poli.findUnique({ where: { kode_poli: code } });
  if (!poli) throw new AppError(404, 'Poli tidak ditemukan');
  if (poli.aktifonline !== 1) throw new AppError(409, 'Poli sedang tutup', { code: 'POLI_CLOSED' });
  if (norm) {
    const patient = await prisma.pasien.findUnique({ where: { norm } });
    if (!patient) throw new AppError(404, 'Pasien tidak ditemukan berdasarkan nomor rekam medis');
  }
  if (dokter) {
    const doctor = await prisma.dokter.findUnique({ where: { kodedokter: dokter } });
    if (!doctor) throw new AppError(404, 'Dokter tidak ditemukan');
    if (doctor.aktif !== 1) throw new AppError(409, 'Dokter sedang tidak aktif');
  }

  const date = todayDate();
  let registration;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      registration = await prisma.$transaction(async (tx) => {
        const last = await tx.pendaftaran.findFirst({
          where: { tanggalberobat: date, poli: code },
          orderBy: { noantripoli: 'desc' }, select: { noantripoli: true }
        });
        const number = (last?.noantripoli ?? 0) + 1;
        const ticket = makeTicket(code, number);
        const created = await tx.pendaftaran.create({
          data: {
            tiketreg: ticket, noantripoli: number, tanggalberobat: date,
            norm: norm || null, poli: code, dokter: dokter || null,
            jamdatang: jamdatang || new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour12: false }),
            jenisantrian: jenisantrian || 'Umum', status_pendaftaran: QUEUE_STATUS.WAITING
          }
        });
        await tx.taskAntrian.create({ data: { kodebooking: ticket, tanggal: date, task1: new Date() } });
        return created;
      }, { isolationLevel: 'Serializable' });
      break;
    } catch (error) {
      if ((error.code === 'P2034' || error.code === 'P2002') && attempt < 3) continue;
      throw error;
    }
  }
  const fullQueue = await fetchQueue(registration.tiketreg, date);
  return { ...fullQueue, nomor_tiket: makeTicket(code, fullQueue.noantripoli), tanggal_lokal: jakartaDateString() };
}

export async function listQueues({ poliCode, status, date, user }) {
  const tanggalberobat = dateFromQuery(date);
  if (status && !isQueueStatus(status)) throw new AppError(400, 'Status antrean tidak valid', { allowed: Object.values(QUEUE_STATUS) });
  if (poliCode) poliCode = String(poliCode).trim().toUpperCase();
  const where = { tanggalberobat };
  if (status) where.status_pendaftaran = status;

  if (user.grupuser !== 'admin') {
    const assigned = assignedPolies(user);
    if (poliCode) {
      assertStaffOwnsPoli(user, poliCode);
      where.poli = poliCode;
    } else {
      where.poli = { in: assigned };
    }
  } else if (poliCode) {
    where.poli = poliCode;
  }

  return prisma.pendaftaran.findMany({ where, orderBy: [{ poli: 'asc' }, { noantripoli: 'asc' }], include: queueInclude });
}

export async function callNext({ poliCode, user }) {
  if (!poliCode) throw new AppError(400, 'poli wajib diisi');
  poliCode = String(poliCode).trim().toUpperCase();
  assertStaffOwnsPoli(user, poliCode);
  const date = todayDate();
  const updated = await prisma.$transaction(async (tx) => {
    const activeQueue = await tx.pendaftaran.findFirst({
      where: { poli: poliCode, tanggalberobat: date, status_pendaftaran: QUEUE_STATUS.CALLED },
      select: { tiketreg: true }
    });
    if (activeQueue) throw new AppError(409, 'Masih ada antrean yang sedang dipanggil; selesaikan, recall, atau lewati antrean tersebut terlebih dahulu', { tiketreg: activeQueue.tiketreg });
    const queue = await tx.pendaftaran.findFirst({
      where: { poli: poliCode, tanggalberobat: date, status_pendaftaran: QUEUE_STATUS.WAITING },
      orderBy: { noantripoli: 'asc' }, select: { noindex: true, tiketreg: true, tanggalberobat: true }
    });
    if (!queue) throw new AppError(404, 'Tidak ada antrian menunggu', { code: 'QUEUE_EMPTY' });
    const changed = await tx.pendaftaran.updateMany({
      where: { noindex: queue.noindex, status_pendaftaran: QUEUE_STATUS.WAITING },
      data: { status_pendaftaran: QUEUE_STATUS.CALLED }
    });
    if (changed.count !== 1) throw new AppError(409, 'Antrian baru saja diproses petugas lain; silakan ulangi');
    await catatTask(tx, queue.tiketreg, queue.tanggalberobat, 3);
    return queue;
  }, { isolationLevel: 'Serializable' });
  return actionResult(await fetchQueue(updated.tiketreg, updated.tanggalberobat), 'call');
}

export async function recall(tiketreg, user, date = todayDate()) {
  const queue = await fetchQueue(tiketreg, date);
  assertStaffOwnsPoli(user, queue.poli);
  assertQueueStatus(queue.status_pendaftaran, QUEUE_STATUS.CALLED, 'Hanya antrian berstatus called yang dapat dipanggil ulang');
  return actionResult(queue, 'recall'); // self-loop, status stays called
}

export async function skip(tiketreg, user, date = todayDate()) {
  const queue = await fetchQueue(tiketreg, date);
  assertStaffOwnsPoli(user, queue.poli);
  assertQueueStatus(queue.status_pendaftaran, QUEUE_STATUS.CALLED, 'Antrian hanya dapat dilewati setelah dipanggil');
  const changed = await prisma.pendaftaran.updateMany({
    where: { noindex: queue.noindex, status_pendaftaran: QUEUE_STATUS.CALLED },
    data: { status_pendaftaran: QUEUE_STATUS.SKIPPED }
  });
  if (changed.count !== 1) throw new AppError(409, 'Status antrian berubah; muat ulang data dan coba lagi');
  return actionResult(await fetchQueue(tiketreg, date), 'skip');
}

export async function finish(tiketreg, user, date = todayDate()) {
  const queue = await fetchQueue(tiketreg, date);
  assertStaffOwnsPoli(user, queue.poli);
  assertQueueStatus(queue.status_pendaftaran, QUEUE_STATUS.CALLED, 'Antrian belum dipanggil / tidak sedang dilayani');
  await prisma.$transaction(async (tx) => {
    const changed = await tx.pendaftaran.updateMany({
      where: { noindex: queue.noindex, status_pendaftaran: QUEUE_STATUS.CALLED },
      data: { status_pendaftaran: QUEUE_STATUS.DONE }
    });
    if (changed.count !== 1) throw new AppError(409, 'Status antrian berubah; muat ulang data dan coba lagi');
    await catatTask(tx, tiketreg, date, 5);
  });
  return actionResult(await fetchQueue(tiketreg, date), 'done');
}

export async function getDisplayState(poliCode) {
  if (poliCode) poliCode = String(poliCode).trim().toUpperCase();
  const date = todayDate();
  const [polies, active, counts] = await prisma.$transaction([
    prisma.poli.findMany({ orderBy: { poli: 'asc' }, select: { kode_poli: true, poli: true, aktifonline: true } }),
    prisma.pendaftaran.findMany({
      where: { tanggalberobat: date, status_pendaftaran: QUEUE_STATUS.CALLED, ...(poliCode ? { poli: poliCode } : {}) },
      orderBy: [{ poli: 'asc' }, { noantripoli: 'asc' }], select: { noindex: true, tiketreg: true, noantripoli: true, poli: true, status_pendaftaran: true }
    }),
    prisma.pendaftaran.groupBy({
      by: ['poli', 'status_pendaftaran'], where: { tanggalberobat: date, ...(poliCode ? { poli: poliCode } : {}) }, _count: { _all: true }
    })
  ]);
  const countsByPoli = new Map();
  for (const row of counts) {
    if (!row.poli) continue;
    const values = countsByPoli.get(row.poli) ?? { totalAntrianHariIni: 0, totalMenunggu: 0, totalDipanggil: 0, totalDilewati: 0, totalSelesai: 0 };
    values.totalAntrianHariIni += row._count._all;
    if (row.status_pendaftaran === QUEUE_STATUS.WAITING) values.totalMenunggu += row._count._all;
    if (row.status_pendaftaran === QUEUE_STATUS.CALLED) values.totalDipanggil += row._count._all;
    if (row.status_pendaftaran === QUEUE_STATUS.SKIPPED) values.totalDilewati += row._count._all;
    if (row.status_pendaftaran === QUEUE_STATUS.DONE) values.totalSelesai += row._count._all;
    countsByPoli.set(row.poli, values);
  }
  return {
    tanggal: jakartaDateString(),
    polies: polies.filter((poli) => !poliCode || poli.kode_poli === poliCode).map((poli) => ({
      ...poli, currentQueue: active.find((queue) => queue.poli === poli.kode_poli) ?? null,
      ...(countsByPoli.get(poli.kode_poli) ?? { totalAntrianHariIni: 0, totalMenunggu: 0, totalDipanggil: 0, totalDilewati: 0, totalSelesai: 0 })
    }))
  };
}

export async function getPatient(norm) {
  const patient = await prisma.pasien.findUnique({ where: { norm }, select: { norm: true, nama: true } });
  if (!patient) throw new AppError(404, 'Pasien tidak ditemukan');
  return patient;
}

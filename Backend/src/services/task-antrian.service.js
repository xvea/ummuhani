import { AppError } from '../utils/http.js';

const TASK_FIELDS = Object.freeze({
  1: 'task1',
  2: 'task2',
  3: 'task3',
  4: 'task4',
  5: 'task5',
  6: 'task6',
  7: 'task7'
});

export function taskFieldFor(taskKe) {
  const field = TASK_FIELDS[Number(taskKe)];
  if (!field) throw new AppError(400, 'taskKe harus bernilai 1 sampai 7');
  return field;
}

/**
 * Record a Task_Antrian timestamp inside an existing Prisma transaction.
 * Only the first timestamp is preserved, so it cooperates with the database trigger.
 */
export async function catatTask(tx, tiketreg, tanggal, taskKe, waktu = new Date()) {
  if (!tiketreg || !tanggal) throw new AppError(400, 'tiketreg dan tanggal wajib diisi untuk mencatat Task_Antrian');
  const field = taskFieldFor(taskKe);
  return tx.taskAntrian.updateMany({
    where: { kodebooking: tiketreg, tanggal, [field]: null },
    data: { [field]: waktu }
  });
}

// Explicit model-like facade matching SDD Class Diagram terminology.
export class TaskAntrian {
  static catatTask(tx, tiketreg, tanggal, taskKe, waktu = new Date()) {
    return catatTask(tx, tiketreg, tanggal, taskKe, waktu);
  }
}

import { AppError } from './http.js';

export const QUEUE_STATUS = Object.freeze({ WAITING: 'waiting', CALLED: 'called', SKIPPED: 'skipped', DONE: 'done' });

export function makeTicket(kodePoli, number) {
  return `${kodePoli}-${String(number).padStart(2, '0')}`;
}

export function assertQueueStatus(actual, expected, message, statusCode = 400) {
  if (actual !== expected) throw new AppError(statusCode, message, { actual, expected });
}

export function isQueueStatus(value) {
  return Object.values(QUEUE_STATUS).includes(value);
}

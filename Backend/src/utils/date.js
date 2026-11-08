import { AppError } from './http.js';

const TIME_ZONE = 'Asia/Jakarta';

export function jakartaDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function prismaDate(dateString = jakartaDateString()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new AppError(400, 'Format tanggal harus YYYY-MM-DD');
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== dateString) throw new AppError(400, 'Tanggal tidak valid');
  return date;
}

export function todayDate() {
  return prismaDate(jakartaDateString());
}

export function dateFromQuery(value) {
  return value ? prismaDate(String(value)) : todayDate();
}

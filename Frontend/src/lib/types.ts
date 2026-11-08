/**
 * Tipe data bersama Frontend, mengikuti respons Backend (Ummu Hani/Backend).
 * Status antrian mengikuti SDD Bab 8.
 */
export type QueueStatus = "waiting" | "called" | "done" | "skipped";

/** Respons standar Backend: { success, data } atau { success: false, message } */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string; details?: unknown };

export type Poli = {
  kode_poli: string;
  poli: string;
  aktifonline: number; // 1 = Buka, 0 = Tutup
  deskripsi: string | null;
};

export type Role = "admin" | "petugas";

export type SessionUser = {
  login: string;
  namalengkap: string;
  grupuser: Role;
  poli: string | null;
};

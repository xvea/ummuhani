import type { ApiResponse } from "./types";

/**
 * Alamat Backend. Diatur di file .env.local (NEXT_PUBLIC_API_URL).
 * Saat integrasi ke server RS, cukup ganti nilai di .env, tidak perlu ubah kode.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

/**
 * Pemanggil API Backend. Frontend TIDAK mengakses database secara langsung,
 * semua lewat fungsi ini (prinsip integrasi di CLAUDE.md).
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store", // data antrian selalu real-time (SRS 2.3: tanpa cache)
  });

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json || json.success === false) {
    const message =
      json && json.success === false ? json.message : "Tidak dapat terhubung ke server";
    const details = json && json.success === false ? json.details : undefined;
    throw new ApiError(response.status, message, details);
  }
  return json.data;
}

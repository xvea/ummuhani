import { ok } from '../utils/http.js';
import { AppError } from '../utils/http.js';

export async function error(req, res) {
  const { message, code, page, poli, tiketreg } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim()) throw new AppError(400, 'message wajib diisi');
  // Uses structured process logs; no patient-sensitive payload is required for an audio diagnostic.
  console.warn(JSON.stringify({
    event: 'display.audio.error', at: new Date().toISOString(), code: typeof code === 'string' ? code.slice(0, 80) : null,
    message: message.slice(0, 500), page: typeof page === 'string' ? page.slice(0, 80) : null,
    poli: typeof poli === 'string' ? poli.slice(0, 20) : null,
    tiketreg: typeof tiketreg === 'string' ? tiketreg.slice(0, 50) : null
  }));
  return ok(res, { accepted: true }, 202);
}

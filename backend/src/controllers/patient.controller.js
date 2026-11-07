import { getPatient } from '../services/queue.service.js';
import { ok } from '../utils/http.js';

export async function get(req, res) {
  return ok(res, await getPatient(req.params.norm));
}

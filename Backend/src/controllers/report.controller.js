import * as service from '../services/report.service.js';
import { ok } from '../utils/http.js';

export async function list(req, res) {
  return ok(res, await service.getReport({ tanggal: req.query.tanggal, poli: req.query.poli }));
}

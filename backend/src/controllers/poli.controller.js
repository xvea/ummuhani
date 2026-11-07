import * as service from '../services/poli.service.js';
import { ok } from '../utils/http.js';

export async function list(req, res) {
  return ok(res, await service.listPoli({ onlyOpen: req.query.open === 'true' }));
}

export async function get(req, res) {
  const poli = await service.getPoli(req.params.kode_poli);
  return poli ? ok(res, poli) : res.status(404).json({ success: false, message: 'Poli tidak ditemukan' });
}

export async function adminList(_req, res) {
  return ok(res, await service.listAdminPoli());
}

export async function create(req, res) {
  const poli = await service.createPoli(req.body);
  req.app.get('socketManager').broadcastUpdate({ actionType: 'created', poli });
  return ok(res, poli, 201);
}

export async function update(req, res) {
  const poli = await service.updatePoli(req.params.kode_poli, req.body);
  req.app.get('socketManager').broadcastUpdate({ actionType: 'updated', poli });
  return ok(res, poli);
}

export async function setStatus(req, res) {
  const poli = await service.setPoliStatus(req.params.kode_poli, req.body.aktifonline);
  req.app.get('socketManager').broadcastUpdate({ actionType: 'status', poli });
  return ok(res, poli);
}

export async function remove(req, res) {
  const kode_poli = req.params.kode_poli;
  const result = await service.deletePoli(kode_poli);
  req.app.get('socketManager').broadcastUpdate({ actionType: 'deleted', poli: { kode_poli } });
  return ok(res, result);
}

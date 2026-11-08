import * as service from '../services/queue.service.js';
import { ok } from '../utils/http.js';

function broadcast(req, result) {
  const socket = req.app.get('socketManager');
  socket.broadcastUpdate(result);
  if (result.actionType === 'call' || result.actionType === 'recall') socket.emitTTS(result);
}

export async function create(req, res) {
  const queue = await service.createQueue({
    poliCode: req.body.poli,
    norm: req.body.norm || null,
    dokter: req.body.dokter || null,
    jenisantrian: req.body.jenisantrian || null,
    jamdatang: req.body.jamdatang || null
  });
  broadcast(req, { queue, actionType: 'create' });
  return ok(res, queue, 201);
}

export async function list(req, res) {
  return ok(res, await service.listQueues({
    poliCode: req.query.poli,
    status: req.query.status,
    date: req.query.tanggal,
    user: req.user
  }));
}

export async function callNext(req, res) {
  const result = await service.callNext({ poliCode: req.body.poli, user: req.user });
  broadcast(req, result);
  return ok(res, result.queue);
}

export async function recall(req, res) {
  const result = await service.recall(req.params.tiketreg, req.user);
  broadcast(req, result);
  return ok(res, result.queue);
}

export async function skip(req, res) {
  const result = await service.skip(req.params.tiketreg, req.user);
  broadcast(req, result);
  return ok(res, result.queue);
}

export async function finish(req, res) {
  const result = await service.finish(req.params.tiketreg, req.user);
  broadcast(req, result);
  return ok(res, result.queue);
}

export async function display(req, res) {
  return ok(res, await service.getDisplayState(req.query.poli));
}

// Named controller facade matching the SDD class/module terminology.
export class AntrianController {
  static create(req, res) { return create(req, res); }
  static ambilAntrian(req, res) { return create(req, res); }
  static list(req, res) { return list(req, res); }
  static callNext(req, res) { return callNext(req, res); }
  static panggilAntrian(req, res) { return callNext(req, res); }
  static recall(req, res) { return recall(req, res); }
  static panggilUlang(req, res) { return recall(req, res); }
  static skip(req, res) { return skip(req, res); }
  static lewatiAntrian(req, res) { return skip(req, res); }
  static finish(req, res) { return finish(req, res); }
  static selesaiPelayanan(req, res) { return finish(req, res); }
  static display(req, res) { return display(req, res); }
}

import * as service from '../services/auth.service.js';
import { ok } from '../utils/http.js';

export async function login(req, res) {
  return ok(res, await service.login(req.body.login.trim(), req.body.password));
}

export async function logout(req, res) {
  return ok(res, await service.logout(req.user.login));
}

export async function validasiToken(token) {
  return service.validasiToken(token);
}

export async function me(req, res) {
  return ok(res, await service.getMe(req.user.login));
}

export async function listStaff(_req, res) {
  return ok(res, await service.listStaff());
}

export async function createStaff(req, res) {
  return ok(res, await service.createStaff(req.body), 201);
}

export async function updateStaff(req, res) {
  return ok(res, await service.updateStaff(req.params.login, req.body));
}

export async function deleteStaff(req, res) {
  return ok(res, await service.deleteStaff(req.params.login, req.user.login));
}

// Named controller facade matching the SDD class/module terminology.
export class AuthController {
  static login(req, res) { return login(req, res); }
  static logout(req, res) { return logout(req, res); }
  static validasiToken(token) { return validasiToken(token); }
  static me(req, res) { return me(req, res); }
  static listStaff(req, res) { return listStaff(req, res); }
  static createStaff(req, res) { return createStaff(req, res); }
  static updateStaff(req, res) { return updateStaff(req, res); }
  static deleteStaff(req, res) { return deleteStaff(req, res); }
}

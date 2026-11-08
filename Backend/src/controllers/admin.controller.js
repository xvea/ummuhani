import * as poli from './poli.controller.js';
import * as auth from './auth.controller.js';
import * as report from './report.controller.js';

// AdminController facade is kept separate from AuthController/PoliController
// so the route surface follows the Class Diagram terminology in the backlog.
export class AdminController {
  static listPoli(req, res) { return poli.adminList(req, res); }
  static kelolaPoli(req, res) { return poli.adminList(req, res); }
  static createPoli(req, res) { return poli.create(req, res); }
  static updatePoli(req, res) { return poli.update(req, res); }
  static setPoliStatus(req, res) { return poli.setStatus(req, res); }
  static deletePoli(req, res) { return poli.remove(req, res); }
  static listUsers(req, res) { return auth.listStaff(req, res); }
  static kelolaUser(req, res) { return auth.listStaff(req, res); }
  static createUser(req, res) { return auth.createStaff(req, res); }
  static updateUser(req, res) { return auth.updateStaff(req, res); }
  static deleteUser(req, res) { return auth.deleteStaff(req, res); }
  static listReport(req, res) { return report.list(req, res); }
  static lihatRekap(req, res) { return report.list(req, res); }
}

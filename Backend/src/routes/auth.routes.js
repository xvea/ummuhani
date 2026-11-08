import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { requiredBody, validateBody } from '../middlewares/validate.js';
import { AppError } from '../utils/http.js';

const router = Router();
router.post('/login', requiredBody(['login', 'password']), validateBody((body) => {
  if (typeof body.login !== 'string' || body.login.length > 50) throw new AppError(400, 'login maksimal 50 karakter');
  if (typeof body.password !== 'string' || body.password.length < 1) throw new AppError(400, 'password wajib berupa string');
}), c.login);
router.post('/logout', authenticate, c.logout);
router.get('/me', authenticate, c.me);
// Backward-compatible aliases; the backlog's canonical user routes live under /api/admin/users.
router.get('/staff', authenticate, requireAdmin, c.listStaff);
router.post('/staff', authenticate, requireAdmin, requiredBody(['login', 'password', 'namalengkap']), c.createStaff);
router.put('/staff/:login', authenticate, requireAdmin, c.updateStaff);
router.delete('/staff/:login', authenticate, requireAdmin, c.deleteStaff);
export default router;

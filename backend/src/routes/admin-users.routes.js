import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { requiredBody } from '../middlewares/validate.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', AdminController.kelolaUser);
router.post('/', requiredBody(['login', 'password', 'namalengkap']), AdminController.createUser);
router.put('/:login', AdminController.updateUser);
router.delete('/:login', AdminController.deleteUser);
export default router;

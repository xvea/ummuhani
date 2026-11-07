import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', AdminController.lihatRekap);
export default router;

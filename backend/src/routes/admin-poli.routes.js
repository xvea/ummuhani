import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import { requiredBody } from '../middlewares/validate.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/', AdminController.kelolaPoli);
router.post('/', requiredBody(['kode_poli', 'poli']), AdminController.createPoli);
router.put('/:kode_poli', AdminController.updatePoli);
router.patch('/:kode_poli/status', requiredBody(['aktifonline']), AdminController.setPoliStatus);
router.delete('/:kode_poli', AdminController.deletePoli);
export default router;

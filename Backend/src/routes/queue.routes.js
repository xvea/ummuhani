import { Router } from 'express';
import { AntrianController } from '../controllers/queue.controller.js';
import { authenticate, requirePetugas } from '../middlewares/auth.js';
import { requiredBody } from '../middlewares/validate.js';

const router = Router();
router.get('/display', AntrianController.display);
router.post('/', requiredBody(['poli']), AntrianController.ambilAntrian);
router.get('/', authenticate, requirePetugas, AntrianController.list);
router.post('/panggil', authenticate, requirePetugas, requiredBody(['poli']), AntrianController.panggilAntrian);
router.post('/:tiketreg/panggil-ulang', authenticate, requirePetugas, AntrianController.panggilUlang);
router.post('/:tiketreg/lewati', authenticate, requirePetugas, AntrianController.lewatiAntrian);
router.post('/:tiketreg/selesai', authenticate, requirePetugas, AntrianController.selesaiPelayanan);
export default router;

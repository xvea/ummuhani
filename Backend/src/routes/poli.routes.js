import { Router } from 'express';
import * as c from '../controllers/poli.controller.js';

const router = Router();
router.get('/', c.list);
router.get('/:kode_poli', c.get);
export default router;

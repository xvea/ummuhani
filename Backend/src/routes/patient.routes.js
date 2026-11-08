import { Router } from 'express';
import * as c from '../controllers/patient.controller.js';
const router = Router();
router.get('/:norm', c.get);
export default router;

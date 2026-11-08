import { Router } from 'express';
import * as c from '../controllers/audio.controller.js';
const router = Router();
router.post('/audio-error', c.error);
export default router;

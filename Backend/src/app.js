import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import poliRoutes from './routes/poli.routes.js';
import adminPoliRoutes from './routes/admin-poli.routes.js';
import adminUsersRoutes from './routes/admin-users.routes.js';
import adminReportsRoutes from './routes/admin-reports.routes.js';
import queueRoutes from './routes/queue.routes.js';
import patientRoutes from './routes/patient.routes.js';
import audioRoutes from './routes/audio.routes.js';
import { notFound, errorHandler } from './middlewares/error.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin CORS tidak diizinkan: ${origin}`));
    },
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));

  app.get('/api/health', (_req, res) => res.status(200).json({ success: true, data: { status: 'ok', service: 'rs-queue-backend' } }));
  app.get('/health', (_req, res) => res.status(200).json({ success: true, data: { status: 'ok', service: 'rs-queue-backend' } }));
  app.get('/api/health/ready', async (_req, res, next) => {
    try {
      const { prisma } = await import('./config/prisma.js');
      await prisma.$queryRaw`SELECT 1`;
      return res.status(200).json({ success: true, data: { status: 'ready', database: 'connected' } });
    } catch (error) { return next(Object.assign(new Error('Database belum dapat diakses'), { status: 503, cause: error })); }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/poli', poliRoutes);
  app.use('/api/admin/poli', adminPoliRoutes);
  app.use('/api/admin/users', adminUsersRoutes);
  app.use('/api/admin/rekap', adminReportsRoutes);
  app.use('/api/antrian', queueRoutes);
  app.use('/api/pasien', patientRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/logs', audioRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

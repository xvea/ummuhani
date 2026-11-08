import { Server } from 'socket.io';
import { env } from '../config/env.js';

export class SocketManager {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: env.corsOrigins, credentials: true },
      serveClient: true
    });

    this.io.on('connection', (socket) => {
      socket.join('room:global');
      socket.on('join:poli', (value) => {
        if (typeof value === 'string' && /^[a-zA-Z0-9_-]{1,20}$/.test(value.trim())) socket.join(`poli:${value.trim().toUpperCase()}`);
      });
      socket.on('leave:poli', (value) => {
        if (typeof value === 'string') socket.leave(`poli:${value.trim().toUpperCase()}`);
      });
      socket.on('join:display', () => socket.join('room:display'));
      socket.on('join:kiosk', () => socket.join('room:kiosk'));
      socket.on('join:loket', (value) => {
        if (typeof value === 'string' && /^[a-zA-Z0-9_-]{1,20}$/.test(value.trim())) socket.join(`poli:${value.trim().toUpperCase()}`);
      });
    });
  }

  broadcastUpdate(event = {}) {
    // The backlog uses the same SocketManager entry point for queue and poli changes.
    if (event.poli && !event.queue) return this.broadcastPoliUpdate(event);
    const { queue, actionType } = event;
    if (!queue) return;
    const payload = { actionType, queue };
    if (queue.poli) this.io.to(`poli:${queue.poli}`).emit('queue:update', payload);
    this.io.to('room:global').emit('queue:update', payload);
    this.io.to('room:display').emit('queue:update', payload);
    this.io.to('room:kiosk').emit('queue:update', payload);
    this.io.emit('queue:update:all', payload);
  }

  emitTTS({ queue, actionType }) {
    if (!queue) return;
    const payload = {
      actionType,
      tiketreg: queue.tiketreg,
      nomor_tiket: queue.nomor_tiket ?? queue.tiketreg,
      noantripoli: queue.noantripoli,
      poli: queue.poli,
      nama_poli: queue.poliRef?.poli ?? queue.poli,
      text: `Nomor antrian ${queue.noantripoli}, silakan menuju ${queue.poliRef?.poli ?? queue.poli}`
    };
    this.io.to('room:display').emit('queue:tts', payload);
    this.io.to(`poli:${queue.poli}`).emit('queue:tts', payload);
  }

  broadcastPoliUpdate({ actionType, poli }) {
    const payload = { actionType, poli };
    this.io.to('room:global').emit('poli:update', payload);
    this.io.to('room:kiosk').emit('poli:update', payload);
    this.io.emit('poli:status', payload);
  }
}

export function createSocketManager(httpServer) {
  return new SocketManager(httpServer);
}

import http from 'node:http';
import { createApp } from './app.js';
import { SocketManager } from './sockets/index.js';
import { env, assertRuntimeConfig } from './config/env.js';
import { prisma } from './config/prisma.js';

assertRuntimeConfig();
const app = createApp();
const server = http.createServer(app);
const socketManager = new SocketManager(server);
app.set('socketManager', socketManager);

server.listen(env.port, env.host, () => {
  console.log(`RS Queue Backend listening on http://${env.host}:${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/api/health`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    socketManager.io.close();
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

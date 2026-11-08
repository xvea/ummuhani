module.exports = {
  apps: [{
    name: 'rs-ummu-hani-queue-backend',
    script: 'src/server.js',
    cwd: __dirname + '/../..',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '350M',
    env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: 3001 }
  }]
};

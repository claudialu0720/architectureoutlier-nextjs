module.exports = {
  apps: [
    {
      name: 'careertest',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      // Pin to Node 20 so better-sqlite3's native binding (built under Node 20)
      // matches the runtime ABI, even though the PM2 daemon runs Node 24 for other apps.
      // NOTE: `interpreter` is ignored in cluster mode — keep exec_mode: 'fork'.
      interpreter: '/root/.nvm/versions/node/v20.20.2/bin/node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_PATH: '/var/lib/careertest/data.db',
      },
    },
  ],
};

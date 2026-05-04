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
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_PATH: '/var/lib/careertest/data.db',
      },
    },
  ],
};

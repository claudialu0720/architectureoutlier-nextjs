import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['better-sqlite3', '@node-rs/argon2'],
  async rewrites() {
    return [
      {
        source: '/test/results/:path*',
        destination: '/results/:path*',
      },
      {
        source: '/test/image_questions/:path*',
        destination: '/image_questions/:path*',
      },
    ];
  },
};

export default config;

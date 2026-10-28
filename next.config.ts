import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '15.252.11.116',
        port: '4005',
        pathname: '/uploads/**',
      },
    ],
  }
};

export default nextConfig;

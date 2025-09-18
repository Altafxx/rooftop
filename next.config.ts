import type { NextConfig } from 'next';

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboard/product',
        destination: '/product'
      },
      {
        source: '/dashboard/tasks',
        destination: '/'
      },
      {
        source: '/dashboard',
        destination: '/'
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com'
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com'
      }
    ],
    domains: ['api.slingacademy.com', 'api.dicebear.com'],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  transpilePackages: ['geist']
};

const configWithPlugins = baseConfig;

const nextConfig = configWithPlugins;
export default nextConfig;
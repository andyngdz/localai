import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.output = 'export';
}

export default nextConfig;

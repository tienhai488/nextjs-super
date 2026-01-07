import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/static/**'
      }
    ],
    qualities: [25, 50, 75, 100],
    unoptimized: process.env.ENVIRONMENT === 'development'
  }
}

export default nextConfig

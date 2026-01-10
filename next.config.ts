import envConfig from '@/config'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/static/**'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ],
    qualities: [25, 50, 75, 100],
    unoptimized: envConfig.ENVIRONMENT === 'development'
  }
}

export default nextConfig

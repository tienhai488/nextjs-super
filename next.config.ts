import envConfig from '@/config'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/static/**'
      },
      // https://api-bigboy.duthanhduoc.com
      // {
      //   protocol: 'https',
      //   hostname: 'api-bigboy.duthanhduoc.com',
      //   pathname: '/static/**'
      // },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ],
    qualities: [25, 50, 75, 100],
    unoptimized: envConfig.ENVIRONMENT === 'development'
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)

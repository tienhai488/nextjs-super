import RefreshTokenHandler from '@/app/[locale]/(public)/(auth)/refresh-token/refresh-token'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Refresh Token Redirect',
  description: 'Refresh Token Redirect',
  robots: {
    index: false
  }
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Refresh token...</div>}>
      <RefreshTokenHandler />
    </Suspense>
  )
}

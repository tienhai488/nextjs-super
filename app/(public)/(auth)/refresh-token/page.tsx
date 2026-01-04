'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function RefreshTokenHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathname = searchParams.get('redirect')

  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        }
      })
    } else {
      router.push('/login')
    }
  }, [redirectPathname, refreshTokenFromUrl, router])

  return <div>Refresh token...</div>
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Refresh token...</div>}>
      <RefreshTokenHandler />
    </Suspense>
  )
}

'use client'

import { useRouter } from '@/i18n/navigation'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshTokenHandler() {
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

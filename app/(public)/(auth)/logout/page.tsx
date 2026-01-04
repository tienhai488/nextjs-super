'use client'

import { getAccessTokenFromLS, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function LogoutHandler() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const refreshTokenFromUrl = searchParams.get('refreshToken') || undefined
  const accessTokenFromUrl = searchParams.get('accessToken') || undefined
  const ref = useRef<Promise<any> | null>(null)

  useEffect(() => {
    const shouldCallLogout =
      (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLS())

    if (!ref.current && shouldCallLogout) {
      ref.current = mutateAsync()
        .catch(() => {
          // ignore
        })
        .finally(() => {
          ref.current = null
          router.push('/login')
        })
      return
    }

    router.push('/login')
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])

  return <div>Logging out...</div>
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Logging out...</div>}>
      <LogoutHandler />
    </Suspense>
  )
}

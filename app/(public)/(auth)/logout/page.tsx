'use client'

import { useAppContext } from '@/components/app-provider'
import { getAccessTokenFromLS, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function LogoutHandler() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setRole } = useAppContext()

  const refreshTokenFromUrl = searchParams.get('refreshToken') || undefined
  const accessTokenFromUrl = searchParams.get('accessToken') || undefined
  const ref = useRef<boolean | null>(null)

  useEffect(() => {
    const shouldCallLogout =
      (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLS())

    if (!ref.current && shouldCallLogout) {
      ref.current = true

      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        setRole(undefined)
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole])

  return <div>Logging out...</div>
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Logging out...</div>}>
      <LogoutHandler />
    </Suspense>
  )
}

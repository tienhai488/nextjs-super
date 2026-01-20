'use client'

import { useAppStore } from '@/components/app-provider'
import { useRouter } from '@/i18n/navigation'
import { getAccessTokenFromLS, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function LogoutHandler() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  // const { setRole, disconnectSocket } = useAppContext()
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
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
        disconnectSocket()
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])

  return <div>Logging out...</div>
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Logging out...</div>}>
      <LogoutHandler />
    </Suspense>
  )
}

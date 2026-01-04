'use client'

import { getAccessTokenFromLS, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken') || undefined
  const accessTokenFromUrl = searchParams.get('accessToken') || undefined
  const ref = useRef<any>(null)

  useEffect(() => {
    if (
      ref.current &&
      ((refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLS()))
    ) {
      ref.current = mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null
        }, 1000)

        router.push('/login')
      })
    } else {
      router.push('/login')
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])

  return <div>Logout...</div>
}

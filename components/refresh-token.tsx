'use client'

import {
  getAccessTokenFromLS,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLS,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return
    }

    let interval: any = null

    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLS()
      const refreshToken = getRefreshTokenFromLocalStorage()

      if (!accessToken || !refreshToken) {
        return
      }

      const decodeAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
      const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }

      const now = Math.round(new Date().getTime() / 1000)

      if (decodeRefreshToken.exp <= now) {
        return
      }

      if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
        try {
          const res = await authApiRequest.refreshToken()

          setAccessTokenToLS(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
        } catch (error) {
          clearInterval(interval)
        }
      }
    }

    checkAndRefreshToken()

    interval = setInterval(checkAndRefreshToken, 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pathname])

  return null
}

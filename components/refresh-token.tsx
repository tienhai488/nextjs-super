'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return
    }

    let interval: any = null

    const onTokenError = () => {
      clearInterval(interval)
      window.location.href = '/login'
      // router.push('/login')
    }

    checkAndRefreshToken({
      onError: onTokenError
    })

    // Check every 1 second
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: onTokenError
        }),
      1000
    )

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pathname, router])

  return null
}

'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) {
      return
    }

    let interval: any = null

    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      }
    })

    interval = setInterval(checkAndRefreshToken, 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pathname])

  return null
}

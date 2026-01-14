'use client'

import socket from '@/lib/socket'
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

    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onRefreshTokenSocket() {
      checkAndRefreshToken({
        onError: onTokenError,
        isForce: true
      })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('refresh-token', onRefreshTokenSocket)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathname, router])

  return null
}

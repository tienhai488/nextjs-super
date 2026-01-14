'use client'

import { useAppContext } from '@/components/app-provider'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']
export default function ListenLogoutSocket() {
  const pathname = usePathname()
  const router = useRouter()
  const logoutMutation = useLogoutMutation()
  const { setRole, socket, disconnectSocket } = useAppContext()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return

    const onLogout = async () => {
      try {
        await logoutMutation.mutateAsync()
        setRole(undefined)
        disconnectSocket()
        router.push('/login')
      } catch (error) {
        handleErrorApi({ error })
      }
    }

    socket?.on('logout', onLogout)

    return () => {
      socket?.off('logout', onLogout)
    }
  }, [pathname, logoutMutation, router, setRole, socket, disconnectSocket])

  return null
}

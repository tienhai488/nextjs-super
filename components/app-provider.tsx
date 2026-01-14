'use client'

import ListenLogoutSocket from '@/components/listen-logout-socket'
import RefreshToken from '@/components/refresh-token'
import { decodeToken, generateSocketInstance, getAccessTokenFromLS, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
      // refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLS()

      if (accessToken) {
        const role = decodeToken(accessToken).role as RoleType

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRoleState(role)
        setSocket(generateSocketInstance(accessToken))
      }

      count.current += 1
    }
  }, [])

  const disconnectSocket = () => {
    socket?.disconnect()
    setSocket(undefined)
  }

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }

  const isAuth = Boolean(role)

  return (
    <AppContext value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        <ListenLogoutSocket />
        {children}
      </QueryClientProvider>
    </AppContext>
  )
}

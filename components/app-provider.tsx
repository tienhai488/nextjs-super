'use client'

import RefreshToken from '@/components/refresh-token'
import { decodeToken, getAccessTokenFromLS, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

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
  setRole: (role?: RoleType | undefined) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  useEffect(() => {
    const accessToken = getAccessTokenFromLS()

    if (accessToken) {
      const role = decodeToken(accessToken).role as RoleType

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoleState(role)
    }
  }, [])

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }

  const isAuth = Boolean(role)

  return (
    <AppContext value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        {children}
      </QueryClientProvider>
    </AppContext>
  )
}

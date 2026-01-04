'use client'

import RefreshToken from '@/components/refresh-token'
import { getAccessTokenFromLS, removeTokensFromLocalStorage } from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuthState] = useState<boolean>(false)

  const setIsAuth = (isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      removeTokensFromLocalStorage()
      setIsAuthState(false)
    }
  }

  useEffect(() => {
    const accessToken = getAccessTokenFromLS()

    if (accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
    }
  }, [])

  return (
    <AppContext value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        <RefreshToken />
        {children}
      </QueryClientProvider>
    </AppContext>
  )
}

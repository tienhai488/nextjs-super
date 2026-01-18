'use client'

import ListenLogoutSocket from '@/components/listen-logout-socket'
import RefreshToken from '@/components/refresh-token'
import { decodeToken, generateSocketInstance, getAccessTokenFromLS, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { create } from 'zustand'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
      // refetchOnMount: false
    }
  }
})

// const AppContext = createContext({
//   isAuth: false,
//   role: undefined as RoleType | undefined,
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket?: Socket | undefined) => {},
//   disconnectSocket: () => {}
// })

type AppStoreType = {
  isAuth: boolean
  role: RoleType | undefined
  setRole: (role?: RoleType | undefined) => void
  socket: Socket | undefined
  setSocket: (socket?: Socket | undefined) => void
  disconnectSocket: () => void
}

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) })
    if (!role) {
      removeTokensFromLocalStorage()
    }
  },
  socket: undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect()
      return { socket: undefined }
    })
  }
}))

// export const useAppContext = () => {`
//   return useContext(AppContext)
// }

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // const [socket, setSocket] = useState<Socket | undefined>(undefined)
  // const [role, setRoleState] = useState<RoleType | undefined>(undefined)
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLS()

      if (accessToken) {
        const role = decodeToken(accessToken).role as RoleType

        setRole(role)
        setSocket(generateSocketInstance(accessToken))
      }

      count.current += 1
    }
  }, [setRole, setSocket])

  // const disconnectSocket = () => {
  //   socket?.disconnect()
  //   setSocket(undefined)
  // }

  // const setRole = (role?: RoleType | undefined) => {
  //   setRoleState(role)
  //   if (!role) {
  //     removeTokensFromLocalStorage()
  //   }
  // }

  return (
    // <AppContext value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
    <QueryClientProvider client={queryClient}>
      <RefreshToken />
      <ListenLogoutSocket />
      {children}
    </QueryClientProvider>
    // </AppContext>
  )
}

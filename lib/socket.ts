import envConfig from '@/config'
import { getAccessTokenFromLS } from '@/lib/utils'
import { io } from 'socket.io-client'

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLS()}`
  }
})

export default socket

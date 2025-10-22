import { DEFAULT_BACKEND_URL } from '@/cores/constants'
import { io } from 'socket.io-client'

export const socket = io(DEFAULT_BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: false
})

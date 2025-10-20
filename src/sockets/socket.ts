import { io } from 'socket.io-client'

const DEFAULT_URL = 'http://localhost:8000'

export const socket = io(DEFAULT_URL, {
  transports: ['websocket']
})

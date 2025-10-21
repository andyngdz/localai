import { io } from 'socket.io-client'
import { socket } from './socket'

export const updateSocketUrl = (url: string) => {
  socket.disconnect()

  const newSocket = io(url, { transports: ['websocket'], autoConnect: false })
  Object.assign(socket, newSocket)
  socket.connect()
}

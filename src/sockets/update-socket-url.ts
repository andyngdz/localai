import { io } from 'socket.io-client'
import { useSocketStore } from './useSocket'

export const updateSocketUrl = (url: string) => {
  // Create new socket with updated URL
  const newSocket = io(url, { transports: ['websocket'], autoConnect: false })

  // Update socket in store (triggers reactive updates)
  useSocketStore.setState({ socket: newSocket })

  // Connect the new socket
  newSocket.connect()
}

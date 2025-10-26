import { io } from 'socket.io-client'
import { SOCKET_CONFIG } from '../constants/socket-config'
import { useSocketStore } from '../states/useSocket'

export const updateSocketUrl = (url: string) => {
  // Create new socket with updated URL
  const newSocket = io(url, SOCKET_CONFIG)

  // Update socket in store (triggers reactive updates)
  useSocketStore.setState({ socket: newSocket })

  // Connect the new socket
  newSocket.connect()
}

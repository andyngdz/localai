import { DEFAULT_BACKEND_URL } from '@/cores/constants'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'
import { SOCKET_CONFIG } from '../constants/socket-config'

interface SocketStore {
  socket: Socket
}

export const useSocketStore = create<SocketStore>(() => ({
  socket: io(DEFAULT_BACKEND_URL, SOCKET_CONFIG)
}))

/**
 * React hook to get the current socket instance.
 * Automatically updates when socket changes (e.g., URL update).
 */
export function useSocket(): Socket {
  return useSocketStore((state) => state.socket)
}

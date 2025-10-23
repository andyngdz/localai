import type { ManagerOptions, SocketOptions } from 'socket.io-client'

/**
 * Shared Socket.IO configuration options used across all socket instances.
 *
 * - transports: ['websocket'] - Use WebSocket only (no long-polling fallback)
 * - autoConnect: false - Manual connection control for dynamic port discovery
 */
export const SOCKET_CONFIG: Partial<ManagerOptions & SocketOptions> = {
  transports: ['websocket'],
  autoConnect: false
} as const

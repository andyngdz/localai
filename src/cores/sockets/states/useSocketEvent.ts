import { useEffect } from 'react'
import { useSocket } from './useSocket'

/**
 * React hook for subscribing to socket events.
 * Automatically handles cleanup on unmount and re-subscribes when socket changes.
 *
 * @example
 * useSocketEvent('download_start', (data) => {
 *   console.log('Download started:', data.id)
 * }, [])
 *
 * @param event - Socket event name
 * @param callback - Event handler function
 * @param deps - Dependencies for the callback (optional)
 */
export function useSocketEvent<T>(
  event: string,
  callback: (data: T) => void,
  deps: React.DependencyList = []
): void {
  const socket = useSocket()

  useEffect(() => {
    // Subscribe to event
    socket.on(event, callback)

    return () => {
      socket.off(event, callback)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, event, callback, ...deps])
}

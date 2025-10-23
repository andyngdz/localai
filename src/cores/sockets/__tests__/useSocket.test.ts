import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Socket } from 'socket.io-client'
import { useSocket, useSocketStore } from '@/cores/sockets'

// Create mock socket
const createMockSocket = () => ({
  disconnect: vi.fn(),
  connect: vi.fn(),
  connected: false,
  id: undefined,
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn()
})

describe('useSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useSocketStore', () => {
    it('has a socket instance', () => {
      const state = useSocketStore.getState()

      expect(state.socket).toBeDefined()
      expect(state.socket).toHaveProperty('connect')
      expect(state.socket).toHaveProperty('disconnect')
      expect(state.socket).toHaveProperty('on')
      expect(state.socket).toHaveProperty('off')
    })
  })

  describe('useSocket hook', () => {
    it('returns the current socket instance', () => {
      const { result } = renderHook(() => useSocket())

      expect(result.current).toBeDefined()
      expect(result.current).toHaveProperty('connect')
      expect(result.current).toHaveProperty('disconnect')
      expect(result.current).toHaveProperty('on')
      expect(result.current).toHaveProperty('off')
    })

    it('returns the same socket instance from store', () => {
      const { result } = renderHook(() => useSocket())
      const storeSocket = useSocketStore.getState().socket

      expect(result.current).toBe(storeSocket)
    })

    it('reactively updates when socket changes in store', () => {
      const { result, rerender } = renderHook(() => useSocket())
      const initialSocket = result.current

      // Create new socket
      const newSocket = createMockSocket() as unknown as Socket

      // Update socket in store
      act(() => {
        useSocketStore.setState({ socket: newSocket })
      })
      rerender()

      // Hook should return new socket
      expect(result.current).not.toBe(initialSocket)
      expect(result.current).toBe(newSocket)
    })

    it('multiple hook instances return the same socket', () => {
      const { result: result1 } = renderHook(() => useSocket())
      const { result: result2 } = renderHook(() => useSocket())

      expect(result1.current).toBe(result2.current)
    })
  })

  describe('socket store reactivity', () => {
    it('updates socket instance when setState is called', () => {
      const initialSocket = useSocketStore.getState().socket

      const newSocket = {
        disconnect: vi.fn(),
        connect: vi.fn(),
        connected: true,
        id: 'new-socket-id',
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn()
      } as unknown as Socket

      act(() => {
        useSocketStore.setState({ socket: newSocket })
      })

      const updatedSocket = useSocketStore.getState().socket

      expect(updatedSocket).not.toBe(initialSocket)
      expect(updatedSocket).toBe(newSocket)
      expect(updatedSocket.connected).toBe(true)
      expect(updatedSocket.id).toBe('new-socket-id')
    })

    it('maintains socket reference stability until explicitly updated', () => {
      const socket1 = useSocketStore.getState().socket
      const socket2 = useSocketStore.getState().socket

      expect(socket1).toBe(socket2)
    })
  })

  describe('integration scenarios', () => {
    it('socket can be updated via store setState', () => {
      const originalSocket = useSocketStore.getState().socket

      // Simulate updateSocketUrl behavior
      const newSocket = createMockSocket() as unknown as Socket

      act(() => {
        useSocketStore.setState({ socket: newSocket })
      })

      const updatedSocket = useSocketStore.getState().socket

      expect(updatedSocket).not.toBe(originalSocket)
      expect(updatedSocket).toBe(newSocket)
    })

    it('hook updates reflect in all subscribers', () => {
      const { result: result1 } = renderHook(() => useSocket())
      const { result: result2 } = renderHook(() => useSocket())

      const initialSocket = result1.current
      const newSocket = createMockSocket() as unknown as Socket

      act(() => {
        useSocketStore.setState({ socket: newSocket })
      })

      // Both hooks should see the new socket
      expect(result1.current).toBe(newSocket)
      expect(result2.current).toBe(newSocket)
      expect(result1.current).not.toBe(initialSocket)
    })
  })
})

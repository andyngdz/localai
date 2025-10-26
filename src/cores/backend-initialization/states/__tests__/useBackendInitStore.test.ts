import { act, renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useBackendInitStore } from '../useBackendInitStore'

describe('useBackendInitStore', () => {
  it('should have initial state of isInitialized as false', () => {
    const { result } = renderHook(() => useBackendInitStore())

    expect(result.current.isInitialized).toBe(false)
  })

  it('should have initial state of baseURL as empty string', () => {
    const { result } = renderHook(() => useBackendInitStore())

    expect(result.current.baseURL).toBe('')
  })

  it('should set isInitialized to true when setInitialized is called with true', () => {
    const { result } = renderHook(() => useBackendInitStore())

    act(() => {
      result.current.setInitialized(true)
    })

    expect(result.current.isInitialized).toBe(true)
  })

  it('should set isInitialized to false when setInitialized is called with false', () => {
    const { result } = renderHook(() => useBackendInitStore())

    // First set to true
    act(() => {
      result.current.setInitialized(true)
    })
    expect(result.current.isInitialized).toBe(true)

    // Then set back to false
    act(() => {
      result.current.setInitialized(false)
    })
    expect(result.current.isInitialized).toBe(false)
  })

  it('should set baseURL when setBaseURL is called', () => {
    const { result } = renderHook(() => useBackendInitStore())

    act(() => {
      result.current.setBaseURL('http://localhost:8001')
    })

    expect(result.current.baseURL).toBe('http://localhost:8001')
  })

  it('should update baseURL when setBaseURL is called multiple times', () => {
    const { result } = renderHook(() => useBackendInitStore())

    act(() => {
      result.current.setBaseURL('http://localhost:8001')
    })
    expect(result.current.baseURL).toBe('http://localhost:8001')

    act(() => {
      result.current.setBaseURL('http://localhost:8002')
    })
    expect(result.current.baseURL).toBe('http://localhost:8002')
  })
})

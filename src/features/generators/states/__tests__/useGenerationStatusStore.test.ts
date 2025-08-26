import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGenerationStatusStore } from '../useGenerationStatusStore'

describe('useGenerationStatusStore', () => {
  it('should initialize with default values', () => {
    // Act
    const { result } = renderHook(() => useGenerationStatusStore())

    // Assert
    expect(result.current.isGenerating).toBe(false)
  })

  it('should update isGenerating state', () => {
    // Arrange
    const { result } = renderHook(() => useGenerationStatusStore())

    // Act - set to true
    act(() => {
      result.current.onSetIsGenerating(true)
    })

    // Assert
    expect(result.current.isGenerating).toBe(true)

    // Act - set to false
    act(() => {
      result.current.onSetIsGenerating(false)
    })

    // Assert
    expect(result.current.isGenerating).toBe(false)
  })

  it('should reset state to initial values', () => {
    // Arrange
    const { result } = renderHook(() => useGenerationStatusStore())

    // Act - change state
    act(() => {
      result.current.onSetIsGenerating(true)
    })
    expect(result.current.isGenerating).toBe(true)

    // Act - reset state
    act(() => {
      result.current.reset()
    })

    // Assert
    expect(result.current.isGenerating).toBe(false)
  })
})

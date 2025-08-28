import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFormValuesStore } from '../useFormValuesStore'
import { FORM_DEFAULT_VALUES } from '../../constants'

// Mock the persist middleware to avoid localStorage issues in tests
vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual('zustand/middleware')
  return {
    ...(actual as object),
    persist: vi.fn().mockImplementation((config) => config)
  }
})

describe('useFormValuesStore', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormValuesStore())

    expect(result.current.values).toEqual(FORM_DEFAULT_VALUES)
  })

  it('should update values when setValues is called', () => {
    const { result } = renderHook(() => useFormValuesStore())
    const newValues = { ...FORM_DEFAULT_VALUES, prompt: 'Test prompt' }

    act(() => {
      result.current.onSetValues(newValues)
    })

    expect(result.current.values).toEqual(newValues)
  })

  it('should reset to default values when reset is called', () => {
    const { result } = renderHook(() => useFormValuesStore())

    // First update a value
    act(() => {
      result.current.onSetValues({
        ...FORM_DEFAULT_VALUES,
        prompt: 'Test prompt'
      })
    })

    // Then reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual(FORM_DEFAULT_VALUES)
  })
})

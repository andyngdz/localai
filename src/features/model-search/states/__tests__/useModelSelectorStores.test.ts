import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { onResetModelId, onUpdateModelId, useModelSelectorStore } from '../useModelSelectorStores'

// Mock the store for testing
const originalState = useModelSelectorStore.getState()

describe('useModelSelectorStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useModelSelectorStore.setState(originalState)
  })

  it('should have initial state', () => {
    const state = useModelSelectorStore.getState()
    expect(state).toEqual({ model_id: '' })
  })

  it('should update model_id when onUpdateModelId is called', () => {
    const testModelId = 'test-model-123'

    act(() => {
      onUpdateModelId(testModelId)
    })

    const state = useModelSelectorStore.getState()
    expect(state.model_id).toBe(testModelId)
  })

  it('should reset model_id when onResetModelId is called', () => {
    // First set a model ID
    act(() => {
      onUpdateModelId('test-model-123')
    })

    // Then reset it
    act(() => {
      onResetModelId()
    })

    const state = useModelSelectorStore.getState()
    expect(state.model_id).toBe('')
  })

  it('should update state correctly with multiple updates', () => {
    const testModel1 = 'model-1'
    const testModel2 = 'model-2'

    act(() => {
      onUpdateModelId(testModel1)
    })
    expect(useModelSelectorStore.getState().model_id).toBe(testModel1)

    act(() => {
      onUpdateModelId(testModel2)
    })
    expect(useModelSelectorStore.getState().model_id).toBe(testModel2)

    act(() => {
      onResetModelId()
    })
    expect(useModelSelectorStore.getState().model_id).toBe('')
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import { useModelSelectorStore } from '../useModelSelectorStores'

describe('useModelSelectorStore', () => {
  // Clear the store after each test
  afterEach(() => {
    useModelSelectorStore.setState({ selected_model_id: '' })
  })

  it('should initialize with empty selected_model_id', () => {
    const state = useModelSelectorStore.getState()
    expect(state.selected_model_id).toBe('')
  })

  it('should update selected_model_id when setSelectedModelId is called', () => {
    const state = useModelSelectorStore.getState()
    state.setSelectedModelId('test-model-id')

    const updatedState = useModelSelectorStore.getState()
    expect(updatedState.selected_model_id).toBe('test-model-id')
  })

  it('should persist the state with proper name', () => {
    // This verifies that the persist middleware is configured correctly

    // Get the persist options from the store
    const persistOptions = useModelSelectorStore.persist?.getOptions()

    expect(persistOptions).toBeDefined()
    expect(persistOptions?.name).toBe('model-selector')
  })
})

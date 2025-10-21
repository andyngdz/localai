import { describe, expect, it } from 'vitest'
import { FORM_DEFAULT_VALUES } from '../../constants'
import { useFormValuesStore } from '../useFormValuesStore'

describe('useFormValuesStore', () => {
  it('should have store methods defined', () => {
    const store = useFormValuesStore.getState()

    expect(store.onSetValues).toBeDefined()
    expect(store.reset).toBeDefined()
    expect(typeof store.onSetValues).toBe('function')
    expect(typeof store.reset).toBe('function')
  })

  it('should update values when onSetValues is called', () => {
    const newValues = { ...FORM_DEFAULT_VALUES, prompt: 'Unique test prompt' }

    useFormValuesStore.getState().onSetValues(newValues)

    const updatedValues = useFormValuesStore.getState().values
    expect(updatedValues).toEqual(newValues)
    expect(updatedValues?.prompt).toBe('Unique test prompt')
  })

  it('should maintain state after reset is called', () => {
    useFormValuesStore.getState().reset()

    const afterReset = useFormValuesStore.getState().values
    expect(afterReset).toBeDefined()
    expect(typeof afterReset).toBe('object')
  })
})

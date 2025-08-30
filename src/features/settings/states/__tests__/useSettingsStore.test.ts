import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSettingsStore } from '../useSettingsStore'
import { SettingFormValues } from '../../types/settings'

// Mock zustand/middleware to avoid localStorage issues in tests
vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual('zustand/middleware')
  return {
    ...(actual as object),
    persist: vi.fn().mockImplementation((config) => config),
    devtools: vi.fn().mockImplementation((config) => config)
  }
})

describe('useSettingsStore', () => {
  const defaultValues: SettingFormValues = {
    baseUrl: 'http://localhost:8000',
    safetyCheck: true
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('store initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useSettingsStore())

      expect(result.current.values).toEqual(defaultValues)
    })

    it('should provide setValues function', () => {
      const { result } = renderHook(() => useSettingsStore())

      expect(result.current.setValues).toBeDefined()
      expect(typeof result.current.setValues).toBe('function')
    })

    it('should provide reset function', () => {
      const { result } = renderHook(() => useSettingsStore())

      expect(result.current.reset).toBeDefined()
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('setValues functionality', () => {
    it('should update baseUrl when setValues is called', () => {
      const { result } = renderHook(() => useSettingsStore())
      const newValues: SettingFormValues = {
        baseUrl: 'http://test.example.com',
        safetyCheck: true
      }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).toEqual(newValues)
      expect(result.current.values.baseUrl).toBe('http://test.example.com')
    })

    it('should update safetyCheck when setValues is called', () => {
      const { result } = renderHook(() => useSettingsStore())
      const newValues: SettingFormValues = {
        baseUrl: 'http://localhost:8000',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).toEqual(newValues)
      expect(result.current.values.safetyCheck).toBe(false)
    })

    it('should update both fields simultaneously', () => {
      const { result } = renderHook(() => useSettingsStore())
      const newValues: SettingFormValues = {
        baseUrl: 'https://api.production.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).toEqual(newValues)
      expect(result.current.values.baseUrl).toBe('https://api.production.com')
      expect(result.current.values.safetyCheck).toBe(false)
    })

    it('should handle multiple sequential updates', () => {
      const { result } = renderHook(() => useSettingsStore())

      const firstUpdate: SettingFormValues = {
        baseUrl: 'http://first.com',
        safetyCheck: false
      }

      const secondUpdate: SettingFormValues = {
        baseUrl: 'http://second.com',
        safetyCheck: true
      }

      act(() => {
        result.current.setValues(firstUpdate)
      })

      expect(result.current.values).toEqual(firstUpdate)

      act(() => {
        result.current.setValues(secondUpdate)
      })

      expect(result.current.values).toEqual(secondUpdate)
    })

    it('should completely replace values object', () => {
      const { result } = renderHook(() => useSettingsStore())
      const originalValues = result.current.values

      const newValues: SettingFormValues = {
        baseUrl: 'http://new.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).not.toBe(originalValues)
      expect(result.current.values).toEqual(newValues)
    })
  })

  describe('reset functionality', () => {
    it('should reset to initial values after modification', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Modify values first
      act(() => {
        result.current.setValues({
          baseUrl: 'http://modified.com',
          safetyCheck: false
        })
      })

      // Verify values were modified
      expect(result.current.values).not.toEqual(defaultValues)

      // Reset values
      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual(defaultValues)
    })

    it('should work when called without prior modifications', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual(defaultValues)
    })

    it('should reset both baseUrl and safetyCheck fields', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Modify both fields
      act(() => {
        result.current.setValues({
          baseUrl: 'http://different.com',
          safetyCheck: false
        })
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.values.baseUrl).toBe(defaultValues.baseUrl)
      expect(result.current.values.safetyCheck).toBe(defaultValues.safetyCheck)
    })

    it('should handle multiple reset calls', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Modify values
      act(() => {
        result.current.setValues({
          baseUrl: 'http://test.com',
          safetyCheck: false
        })
      })

      // Reset multiple times
      act(() => {
        result.current.reset()
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual(defaultValues)
    })
  })

  describe('store persistence and middleware', () => {
    it('should initialize store with middleware configuration', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Verify the store is properly initialized and functional
      expect(result.current.values).toBeDefined()
      expect(result.current.setValues).toBeDefined()
      expect(result.current.reset).toBeDefined()
    })

    it('should maintain state consistency with middleware', () => {
      const { result } = renderHook(() => useSettingsStore())

      const testValues: SettingFormValues = {
        baseUrl: 'http://middleware-test.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(testValues)
      })

      // State should be maintained properly through middleware
      expect(result.current.values).toEqual(testValues)
    })
  })

  describe('type safety and interface compliance', () => {
    it('should enforce SettingFormValues type for setValues parameter', () => {
      const { result } = renderHook(() => useSettingsStore())

      const validValues: SettingFormValues = {
        baseUrl: 'http://valid.com',
        safetyCheck: true
      }

      act(() => {
        result.current.setValues(validValues)
      })

      expect(result.current.values).toEqual(validValues)
    })

    it('should maintain type consistency across operations', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Initial values should match type
      expect(typeof result.current.values.baseUrl).toBe('string')
      expect(typeof result.current.values.safetyCheck).toBe('boolean')

      const newValues: SettingFormValues = {
        baseUrl: 'http://typed.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(newValues)
      })

      // After update, types should remain consistent
      expect(typeof result.current.values.baseUrl).toBe('string')
      expect(typeof result.current.values.safetyCheck).toBe('boolean')
    })

    it('should return correct interface structure', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Verify interface compliance
      expect(result.current).toHaveProperty('values')
      expect(result.current).toHaveProperty('setValues')
      expect(result.current).toHaveProperty('reset')

      // Verify types
      expect(typeof result.current.values).toBe('object')
      expect(typeof result.current.setValues).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('state immutability', () => {
    it('should create new object references when values change', () => {
      const { result } = renderHook(() => useSettingsStore())
      const initialValues = result.current.values

      const newValues: SettingFormValues = {
        baseUrl: 'http://new-reference.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).not.toBe(initialValues)
      expect(result.current.values).toEqual(newValues)
    })

    it('should not mutate input values object', () => {
      const { result } = renderHook(() => useSettingsStore())

      const inputValues: SettingFormValues = {
        baseUrl: 'http://immutable-test.com',
        safetyCheck: false
      }

      const originalInput = { ...inputValues }

      act(() => {
        result.current.setValues(inputValues)
      })

      expect(inputValues).toEqual(originalInput)
    })
  })

  describe('integration scenarios', () => {
    it('should handle realistic workflow of set and reset operations', () => {
      const { result } = renderHook(() => useSettingsStore())

      // Simulate user changing settings
      const userSettings: SettingFormValues = {
        baseUrl: 'http://user-configured.com',
        safetyCheck: false
      }

      act(() => {
        result.current.setValues(userSettings)
      })

      expect(result.current.values).toEqual(userSettings)

      // Simulate user wanting to revert to defaults
      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual(defaultValues)

      // Simulate another configuration
      const finalSettings: SettingFormValues = {
        baseUrl: 'http://final.com',
        safetyCheck: true
      }

      act(() => {
        result.current.setValues(finalSettings)
      })

      expect(result.current.values).toEqual(finalSettings)
    })

    it('should work across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useSettingsStore())
      const { result: result2 } = renderHook(() => useSettingsStore())

      const newValues: SettingFormValues = {
        baseUrl: 'http://shared-state.com',
        safetyCheck: false
      }

      act(() => {
        result1.current.setValues(newValues)
      })

      // Both hooks should reflect the same state
      expect(result1.current.values).toEqual(newValues)
      expect(result2.current.values).toEqual(newValues)

      act(() => {
        result2.current.reset()
      })

      // Both hooks should reflect the reset
      expect(result1.current.values).toEqual(defaultValues)
      expect(result2.current.values).toEqual(defaultValues)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string baseUrl', () => {
      const { result } = renderHook(() => useSettingsStore())

      const valuesWithEmptyUrl: SettingFormValues = {
        baseUrl: '',
        safetyCheck: true
      }

      act(() => {
        result.current.setValues(valuesWithEmptyUrl)
      })

      expect(result.current.values.baseUrl).toBe('')
      expect(result.current.values.safetyCheck).toBe(true)
    })

    it('should handle different URL formats', () => {
      const { result } = renderHook(() => useSettingsStore())

      const urlFormats = [
        'http://localhost:3000',
        'https://secure.example.com',
        'http://192.168.1.100:8080',
        'https://api.example.com/v1'
      ]

      urlFormats.forEach((url) => {
        const values: SettingFormValues = {
          baseUrl: url,
          safetyCheck: true
        }

        act(() => {
          result.current.setValues(values)
        })

        expect(result.current.values.baseUrl).toBe(url)
      })
    })
  })
})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useForm } from 'react-hook-form'
import { useShallowCompareEffect } from 'react-use'
import { useGeneralSettings } from '../useGeneralSettings'
import { useSettingsStore } from '../useSettingsStore'
import { SettingFormValues } from '../../types/settings'

// Mock dependencies
vi.mock('react-hook-form', () => ({
  useForm: vi.fn()
}))

vi.mock('react-use', () => ({
  useShallowCompareEffect: vi.fn()
}))

vi.mock('../useSettingsStore', () => ({
  useSettingsStore: vi.fn()
}))

// Mock zustand/middleware to avoid localStorage issues in tests
vi.mock('zustand/middleware', async () => {
  const actual = await vi.importActual('zustand/middleware')
  return {
    ...(actual as object),
    persist: vi.fn().mockImplementation((config) => config),
    devtools: vi.fn().mockImplementation((config) => config)
  }
})

describe('useGeneralSettings', () => {
  const mockRegister = vi.fn()
  const mockWatch = vi.fn()
  const mockSetValues = vi.fn()

  const mockValues: SettingFormValues = {
    safetyCheck: true
  }

  const mockFormValues: SettingFormValues = {
    safetyCheck: false
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useSettingsStore
    vi.mocked(useSettingsStore).mockReturnValue({
      values: mockValues,
      setValues: mockSetValues,
      reset: vi.fn()
    })

    // Mock useForm
    vi.mocked(useForm).mockReturnValue({
      register: mockRegister,
      watch: mockWatch
    } as unknown as ReturnType<typeof useForm>)

    // Mock watch to return form values
    mockWatch.mockReturnValue(mockFormValues)

    // Mock useShallowCompareEffect to call the effect immediately
    vi.mocked(useShallowCompareEffect).mockImplementation((effect) => {
      effect()
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('hook initialization', () => {
    it('should call useSettingsStore to get values and setValues', () => {
      renderHook(() => useGeneralSettings())

      expect(useSettingsStore).toHaveBeenCalled()
    })

    it('should initialize useForm with correct configuration', () => {
      renderHook(() => useGeneralSettings())

      expect(useForm).toHaveBeenCalledWith({
        defaultValues: mockValues,
        values: mockValues
      })
    })

    it('should return register function from useForm', () => {
      const { result } = renderHook(() => useGeneralSettings())

      expect(result.current.register).toBe(mockRegister)
    })
  })

  describe('form watching and synchronization', () => {
    it('should call watch function to get current form values', () => {
      renderHook(() => useGeneralSettings())

      expect(mockWatch).toHaveBeenCalled()
    })

    it('should use useShallowCompareEffect to sync form values with store', () => {
      renderHook(() => useGeneralSettings())

      expect(useShallowCompareEffect).toHaveBeenCalledWith(
        expect.any(Function),
        [mockFormValues, mockSetValues]
      )
    })

    it('should call setValues with current form values in effect', () => {
      renderHook(() => useGeneralSettings())

      expect(mockSetValues).toHaveBeenCalledWith(mockFormValues)
    })
  })

  describe('form integration', () => {
    it('should pass correct type parameter to useForm', () => {
      renderHook(() => useGeneralSettings())

      expect(useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultValues: expect.any(Object),
          values: expect.any(Object)
        })
      )
    })

    it('should use both defaultValues and values in form configuration', () => {
      renderHook(() => useGeneralSettings())

      expect(useForm).toHaveBeenCalledWith({
        defaultValues: mockValues,
        values: mockValues
      })
    })

    it('should work with different initial values from store', () => {
      const differentValues: SettingFormValues = {
        safetyCheck: false
      }

      vi.mocked(useSettingsStore).mockReturnValue({
        values: differentValues,
        setValues: mockSetValues,
        reset: vi.fn()
      })

      renderHook(() => useGeneralSettings())

      expect(useForm).toHaveBeenCalledWith({
        defaultValues: differentValues,
        values: differentValues
      })
    })
  })

  describe('store synchronization', () => {
    it('should update store when form values change', () => {
      const updatedFormValues: SettingFormValues = {
        safetyCheck: true
      }

      mockWatch.mockReturnValue(updatedFormValues)

      renderHook(() => useGeneralSettings())

      expect(mockSetValues).toHaveBeenCalledWith(updatedFormValues)
    })

    it('should call setValues only when form values actually change', () => {
      let effectCallback: (() => void) | undefined

      vi.mocked(useShallowCompareEffect).mockImplementation((effect) => {
        effectCallback = effect
        // Don't call immediately to test manual triggering
      })

      renderHook(() => useGeneralSettings())

      // Clear previous calls
      mockSetValues.mockClear()

      // Manually trigger the effect
      act(() => {
        effectCallback?.()
      })

      expect(mockSetValues).toHaveBeenCalledWith(mockFormValues)
    })

    it('should handle undefined form values gracefully', () => {
      mockWatch.mockReturnValue(undefined as unknown as SettingFormValues)

      renderHook(() => useGeneralSettings())

      expect(mockSetValues).toHaveBeenCalledWith(undefined)
    })
  })

  describe('dependency arrays', () => {
    it('should include formValues and setValues in useShallowCompareEffect dependencies', () => {
      renderHook(() => useGeneralSettings())

      expect(useShallowCompareEffect).toHaveBeenCalledWith(
        expect.any(Function),
        [mockFormValues, mockSetValues]
      )
    })

    it('should update dependencies when form values change', () => {
      const newFormValues: SettingFormValues = {
        safetyCheck: false
      }

      const { rerender } = renderHook(() => useGeneralSettings())

      // Change mock return value
      mockWatch.mockReturnValue(newFormValues)

      rerender()

      expect(useShallowCompareEffect).toHaveBeenLastCalledWith(
        expect.any(Function),
        [newFormValues, mockSetValues]
      )
    })
  })

  describe('register function behavior', () => {
    it('should return the exact register function from useForm', () => {
      const { result } = renderHook(() => useGeneralSettings())

      expect(result.current.register).toBe(mockRegister)
      expect(result.current.register).not.toBeUndefined()
    })

    it('should allow register function to be called', () => {
      const { result } = renderHook(() => useGeneralSettings())

      result.current.register('safetyCheck')

      expect(mockRegister).toHaveBeenCalledWith('safetyCheck')
    })

    it('should support register function with options', () => {
      const { result } = renderHook(() => useGeneralSettings())
      const registerOptions = { required: true }

      result.current.register('safetyCheck', registerOptions)

      expect(mockRegister).toHaveBeenCalledWith('safetyCheck', registerOptions)
    })
  })

  describe('hook re-rendering', () => {
    it('should maintain stable register reference across re-renders', () => {
      const { result, rerender } = renderHook(() => useGeneralSettings())

      const firstRegister = result.current.register

      rerender()

      expect(result.current.register).toBe(firstRegister)
    })

    it('should handle store values changing across re-renders', () => {
      const { rerender } = renderHook(() => useGeneralSettings())

      const newValues: SettingFormValues = {
        safetyCheck: false
      }

      vi.mocked(useSettingsStore).mockReturnValue({
        values: newValues,
        setValues: mockSetValues,
        reset: vi.fn()
      })

      rerender()

      expect(useForm).toHaveBeenLastCalledWith({
        defaultValues: newValues,
        values: newValues
      })
    })
  })

  describe('error handling', () => {
    it('should handle useSettingsStore returning null values', () => {
      vi.mocked(useSettingsStore).mockReturnValue({
        values: null as unknown as SettingFormValues,
        setValues: mockSetValues,
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGeneralSettings())

      expect(result.current.register).toBe(mockRegister)
      expect(useForm).toHaveBeenCalledWith({
        defaultValues: null,
        values: null
      })
    })

    it('should handle useForm returning undefined register', () => {
      vi.mocked(useForm).mockReturnValue({
        register: undefined,
        watch: mockWatch
      } as unknown as ReturnType<typeof useForm>)

      const { result } = renderHook(() => useGeneralSettings())

      expect(result.current.register).toBeUndefined()
    })

    it('should handle watch function returning null', () => {
      mockWatch.mockReturnValue(null)

      renderHook(() => useGeneralSettings())

      expect(mockSetValues).toHaveBeenCalledWith(null)
    })
  })

  describe('integration scenarios', () => {
    it('should work with realistic form data flow', () => {
      const initialValues: SettingFormValues = {
        safetyCheck: false
      }

      const updatedValues: SettingFormValues = {
        safetyCheck: true
      }

      // Start with initial values
      vi.mocked(useSettingsStore).mockReturnValue({
        values: initialValues,
        setValues: mockSetValues,
        reset: vi.fn()
      })

      mockWatch.mockReturnValue(updatedValues)

      const { result } = renderHook(() => useGeneralSettings())

      // Verify form is initialized with store values
      expect(useForm).toHaveBeenCalledWith({
        defaultValues: initialValues,
        values: initialValues
      })

      // Verify form changes are synced to store
      expect(mockSetValues).toHaveBeenCalledWith(updatedValues)

      // Verify register function is available
      expect(result.current.register).toBe(mockRegister)
    })

    it('should handle rapid form value changes', () => {
      let effectCall = 0
      vi.mocked(useShallowCompareEffect).mockImplementation((effect) => {
        effectCall++
        effect()
      })

      const values1: SettingFormValues = { safetyCheck: true }
      const values2: SettingFormValues = { safetyCheck: false }

      mockWatch.mockReturnValueOnce(values1).mockReturnValueOnce(values2)

      const { rerender } = renderHook(() => useGeneralSettings())

      expect(mockSetValues).toHaveBeenCalledWith(values1)

      rerender()

      expect(mockSetValues).toHaveBeenCalledWith(values2)
      expect(effectCall).toBeGreaterThan(1)
    })
  })
})

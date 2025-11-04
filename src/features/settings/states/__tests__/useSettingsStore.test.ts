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

    it('should initialize modal state as closed', () => {
      const { result } = renderHook(() => useSettingsStore())

      expect(result.current.isModalOpen).toBe(false)
    })

    it('should initialize with general tab selected', () => {
      const { result } = renderHook(() => useSettingsStore())

      expect(result.current.selectedTab).toBe('general')
    })
  })

  describe('setValues functionality', () => {
    it('should update safetyCheck when setValues is called', () => {
      const { result } = renderHook(() => useSettingsStore())
      const newValues: SettingFormValues = { safetyCheck: false }

      act(() => {
        result.current.setValues(newValues)
      })

      expect(result.current.values).toEqual(newValues)
      expect(result.current.values.safetyCheck).toBe(false)
    })
  })

  describe('reset functionality', () => {
    it('should reset to initial values after modification', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.setValues({ safetyCheck: false })
      })

      expect(result.current.values).not.toEqual(defaultValues)

      act(() => {
        result.current.reset()
      })

      expect(result.current.values).toEqual(defaultValues)
    })
  })

  describe('modal control', () => {
    it('should open modal with default general tab', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.openModal()
      })

      expect(result.current.isModalOpen).toBe(true)
      expect(result.current.selectedTab).toBe('general')
    })

    it('should open modal with specified tab', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.openModal('models')
      })

      expect(result.current.isModalOpen).toBe(true)
      expect(result.current.selectedTab).toBe('models')
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.openModal()
      })

      expect(result.current.isModalOpen).toBe(true)

      act(() => {
        result.current.closeModal()
      })

      expect(result.current.isModalOpen).toBe(false)
    })
  })

  describe('tab selection', () => {
    it('should change selected tab', () => {
      const { result } = renderHook(() => useSettingsStore())

      act(() => {
        result.current.setSelectedTab('updates')
      })

      expect(result.current.selectedTab).toBe('updates')
    })
  })
})

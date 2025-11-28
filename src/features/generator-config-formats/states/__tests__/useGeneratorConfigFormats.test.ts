import { UpscaleFactor, UpscalerType } from '@/cores/constants'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { renderHook, act } from '@testing-library/react'
import { UseFormReturn } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeneratorConfigFormats } from '../useGeneratorConfigFormats'

// Mock react-hook-form
const mockWatch = vi.fn()
const mockSetValue = vi.fn()

vi.mock('react-hook-form', () => ({
  useFormContext: () =>
    ({
      watch: mockWatch,
      setValue: mockSetValue
    }) as Partial<UseFormReturn<GeneratorConfigFormValues>>
}))

// Mock react-use with stateful toggle
let mockIsEnabled = false
const mockToggle = vi.fn((value?: boolean) => {
  mockIsEnabled = value ?? !mockIsEnabled
})
vi.mock('react-use', () => ({
  useToggle: () => [mockIsEnabled, mockToggle]
}))

describe('useGeneratorConfigFormats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsEnabled = false
  })

  describe('initialization', () => {
    it('initializes with hires fix disabled when no value exists', () => {
      mockWatch.mockReturnValue(undefined)

      const { result } = renderHook(() => useGeneratorConfigFormats())

      expect(result.current.isHiresFixEnabled).toBe(false)
      expect(mockWatch).toHaveBeenCalledWith('hires_fix')
    })

    it('initializes with hires fix enabled when value exists', () => {
      mockWatch.mockReturnValue({
        upscale_factor: UpscaleFactor.TWO,
        upscaler: UpscalerType.LANCZOS,
        denoising_strength: 0.7,
        steps: 0
      })
      mockIsEnabled = true

      const { result } = renderHook(() => useGeneratorConfigFormats())

      expect(result.current.isHiresFixEnabled).toBe(true)
    })
  })

  describe('onHiresFixToggle', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue(undefined)
    })

    it('enables hires fix with default values when toggled on', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      expect(mockToggle).toHaveBeenCalled()
      expect(mockSetValue).toHaveBeenCalledWith('hires_fix', {
        upscale_factor: UpscaleFactor.TWO,
        upscaler: UpscalerType.LANCZOS,
        denoising_strength: 0.7,
        steps: 0
      })
    })

    it('disables hires fix by setting undefined when toggled off', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(false)
      })

      expect(mockToggle).toHaveBeenCalled()
      expect(mockSetValue).toHaveBeenCalledWith('hires_fix', undefined)
    })

    it('uses Lanczos as default upscaler', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].upscaler).toBe(UpscalerType.LANCZOS)
    })

    it('uses 2x as default upscale factor', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].upscale_factor).toBe(UpscaleFactor.TWO)
    })

    it('uses 0.7 as default denoising strength', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].denoising_strength).toBe(0.7)
    })

    it('uses 0 as default steps (inherit from base)', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].steps).toBe(0)
    })

    it('calls toggleIsHiresFixEnabled with correct value on each toggle', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      expect(mockToggle).toHaveBeenCalledTimes(1)
      expect(mockToggle).toHaveBeenCalledWith(true)

      act(() => {
        result.current.onHiresFixToggle(false)
      })

      expect(mockToggle).toHaveBeenCalledTimes(2)
      expect(mockToggle).toHaveBeenLastCalledWith(false)
    })
  })

  describe('return values', () => {
    it('returns isHiresFixEnabled', () => {
      mockWatch.mockReturnValue(undefined)

      const { result } = renderHook(() => useGeneratorConfigFormats())

      expect(result.current).toHaveProperty('isHiresFixEnabled')
      expect(typeof result.current.isHiresFixEnabled).toBe('boolean')
    })

    it('returns onHiresFixToggle function', () => {
      mockWatch.mockReturnValue(undefined)

      const { result } = renderHook(() => useGeneratorConfigFormats())

      expect(result.current).toHaveProperty('onHiresFixToggle')
      expect(typeof result.current.onHiresFixToggle).toBe('function')
    })
  })
})

import { UpscaleFactor, UpscalerMethod, UpscalerType } from '@/cores/constants'
import { useConfig } from '@/cores/hooks'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { UpscalerSection } from '@/types'
import { renderHook, act } from '@testing-library/react'
import { UseFormReturn } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeneratorConfigFormats } from '../useGeneratorConfigFormats'

// Mock useConfig hook
vi.mock('@/cores/hooks', () => ({
  useConfig: vi.fn()
}))

const mockUpscalerSections: UpscalerSection[] = [
  {
    method: UpscalerMethod.TRADITIONAL,
    title: 'Traditional',
    options: [
      {
        value: UpscalerType.LANCZOS,
        name: 'Lanczos',
        description: 'High quality upscaler',
        suggested_denoise_strength: 0.5,
        method: UpscalerMethod.TRADITIONAL,
        is_recommended: false
      },
      {
        value: UpscalerType.BICUBIC,
        name: 'Bicubic',
        description: 'Smooth upscaler',
        suggested_denoise_strength: 0.4,
        method: UpscalerMethod.TRADITIONAL,
        is_recommended: false
      }
    ]
  }
]

const mockUpscalerOptions = mockUpscalerSections.flatMap(
  (section) => section.options
)

// Mock react-hook-form
const mockWatch = vi.fn()
const mockRegister = vi.fn()
const mockUnregister = vi.fn()
const mockSetValue = vi.fn()

vi.mock('react-hook-form', () => ({
  useFormContext: () =>
    ({
      watch: mockWatch,
      register: mockRegister,
      unregister: mockUnregister,
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
    vi.mocked(useConfig).mockReturnValue({
      upscalers: mockUpscalerSections,
      upscalerOptions: mockUpscalerOptions,
      safety_check_enabled: true,
      gpu_scale_factor: 0.8,
      ram_scale_factor: 0.8,
      total_gpu_memory: 12485197824,
      total_ram_memory: 32943878144,
      device_index: 0
    })
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
        denoising_strength: 0.5,
        steps: 0
      })
      mockIsEnabled = true

      const { result } = renderHook(() => useGeneratorConfigFormats())

      expect(result.current.isHiresFixEnabled).toBe(true)
    })
  })

  describe('onHiresFixToggle - enable', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue(undefined)
    })

    it('registers hires_fix field when toggled on', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      expect(mockRegister).toHaveBeenCalledWith('hires_fix')
    })

    it('sets default values from backend config when toggled on (first-time user)', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      expect(mockSetValue).toHaveBeenCalledWith('hires_fix', {
        upscale_factor: UpscaleFactor.TWO,
        upscaler: UpscalerType.LANCZOS,
        denoising_strength: 0.5, // From backend config
        steps: 0
      })
    })

    it('uses first upscaler from backend config as default', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].upscaler).toBe(UpscalerType.LANCZOS)
    })

    it('uses suggested_denoise_strength from first upscaler', () => {
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      const setValueCall = mockSetValue.mock.calls[0]
      expect(setValueCall[1].denoising_strength).toBe(0.5)
    })

    it('does not set default values when user already has hires_fix config', () => {
      mockWatch.mockReturnValue({
        upscale_factor: UpscaleFactor.THREE,
        upscaler: UpscalerType.NEAREST,
        denoising_strength: 0.3,
        steps: 10
      })

      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      // Should register but NOT set value (user has existing config)
      expect(mockRegister).toHaveBeenCalledWith('hires_fix')
      expect(mockSetValue).not.toHaveBeenCalled()
    })

    it('does not set default values when no upscalers available', () => {
      vi.mocked(useConfig).mockReturnValue({
        upscalers: [],
        upscalerOptions: [],
        safety_check_enabled: true,
        gpu_scale_factor: 0.8,
        ram_scale_factor: 0.8,
        total_gpu_memory: 12485197824,
        total_ram_memory: 32943878144,
        device_index: 0
      })

      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      // Should register but NOT set value (no default upscaler)
      expect(mockRegister).toHaveBeenCalledWith('hires_fix')
      expect(mockSetValue).not.toHaveBeenCalled()
    })
  })

  describe('onHiresFixToggle - disable', () => {
    it('unregisters hires_fix field when toggled off', () => {
      mockWatch.mockReturnValue(undefined)
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(false)
      })

      expect(mockUnregister).toHaveBeenCalledWith('hires_fix')
    })

    it('does not call register or setValue when toggled off', () => {
      mockWatch.mockReturnValue(undefined)
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(false)
      })

      expect(mockRegister).not.toHaveBeenCalled()
      expect(mockSetValue).not.toHaveBeenCalled()
    })
  })

  describe('toggle state', () => {
    it('calls toggleIsHiresFixEnabled with correct value on enable', () => {
      mockWatch.mockReturnValue(undefined)
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(true)
      })

      expect(mockToggle).toHaveBeenCalledWith(true)
    })

    it('calls toggleIsHiresFixEnabled with correct value on disable', () => {
      mockWatch.mockReturnValue(undefined)
      const { result } = renderHook(() => useGeneratorConfigFormats())

      act(() => {
        result.current.onHiresFixToggle(false)
      })

      expect(mockToggle).toHaveBeenCalledWith(false)
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

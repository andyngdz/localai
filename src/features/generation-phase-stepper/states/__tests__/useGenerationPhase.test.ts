import { GenerationPhase } from '@/cores/sockets'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGenerationPhase } from '../useGenerationPhase'
import * as useGenerationPhaseStoreModule from '../useGenerationPhaseStore'

vi.mock('../useGenerationPhaseStore', () => ({
  useGenerationPhaseStore: vi.fn()
}))

describe('useGenerationPhase', () => {
  const mockUseGenerationPhaseStore = vi.mocked(
    useGenerationPhaseStoreModule.useGenerationPhaseStore
  )

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseGenerationPhaseStore.mockReturnValue({
      phases: [],
      current: undefined,
      onPhaseChange: vi.fn(),
      reset: vi.fn()
    })
  })

  describe('isVisible', () => {
    it('returns false when phases is empty and current is undefined', () => {
      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.isVisible).toBe(false)
    })

    it('returns true when phases has items and current is defined', () => {
      mockUseGenerationPhaseStore.mockReturnValue({
        phases: [GenerationPhase.IMAGE_GENERATION],
        current: GenerationPhase.IMAGE_GENERATION,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.isVisible).toBe(true)
    })

    it('returns false when only phases has items', () => {
      mockUseGenerationPhaseStore.mockReturnValue({
        phases: [GenerationPhase.IMAGE_GENERATION],
        current: undefined,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.isVisible).toBe(false)
    })

    it('returns false when only current is defined', () => {
      mockUseGenerationPhaseStore.mockReturnValue({
        phases: [],
        current: GenerationPhase.IMAGE_GENERATION,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.isVisible).toBe(false)
    })
  })

  describe('phases and current', () => {
    it('returns phases from store', () => {
      const phases = [
        GenerationPhase.IMAGE_GENERATION,
        GenerationPhase.UPSCALING
      ]
      mockUseGenerationPhaseStore.mockReturnValue({
        phases,
        current: GenerationPhase.IMAGE_GENERATION,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.phases).toEqual(phases)
    })

    it('returns current from store', () => {
      mockUseGenerationPhaseStore.mockReturnValue({
        phases: [GenerationPhase.IMAGE_GENERATION, GenerationPhase.UPSCALING],
        current: GenerationPhase.UPSCALING,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current.current).toBe(GenerationPhase.UPSCALING)
    })
  })

  describe('integration', () => {
    it('provides all expected properties', () => {
      mockUseGenerationPhaseStore.mockReturnValue({
        phases: [GenerationPhase.IMAGE_GENERATION],
        current: GenerationPhase.IMAGE_GENERATION,
        onPhaseChange: vi.fn(),
        reset: vi.fn()
      })

      const { result } = renderHook(() => useGenerationPhase())

      expect(result.current).toHaveProperty('phases')
      expect(result.current).toHaveProperty('current')
      expect(result.current).toHaveProperty('isVisible')
    })
  })
})

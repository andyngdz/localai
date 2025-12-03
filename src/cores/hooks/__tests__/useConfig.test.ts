import { useBackendConfigQuery } from '@/cores/api-queries'
import { UpscalerMethod, UpscalerType } from '@/cores/constants'
import { createQueryClientWrapper } from '@/cores/test-utils/query-client'
import { createMockQueryResult } from '@/cores/test-utils/query-result-mock'
import { BackendConfig, UpscalerSection } from '@/types'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfig } from '../useConfig'

vi.mock('@/cores/api-queries', () => ({
  useBackendConfigQuery: vi.fn()
}))

describe('useConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty arrays and default safety_check_enabled when query returns undefined', () => {
    // Arrange
    vi.mocked(useBackendConfigQuery).mockReturnValue(
      createMockQueryResult<BackendConfig>()
    )

    // Act
    const { result } = renderHook(() => useConfig(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.upscalers).toEqual([])
    expect(result.current.upscalerOptions).toEqual([])
    expect(result.current.safety_check_enabled).toBe(true)
  })

  it('should return upscalers and upscalerOptions from the query data', () => {
    // Arrange
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

    const mockConfig: BackendConfig = {
      upscalers: mockUpscalerSections,
      safety_check_enabled: false
    }

    vi.mocked(useBackendConfigQuery).mockReturnValue(
      createMockQueryResult(mockConfig)
    )

    // Act
    const { result } = renderHook(() => useConfig(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.upscalers).toEqual(mockUpscalerSections)
    expect(result.current.upscalerOptions).toEqual(
      mockUpscalerSections[0].options
    )
    expect(result.current.safety_check_enabled).toBe(false)
  })

  it('should return empty arrays and default safety_check_enabled when config has no fields', () => {
    // Arrange
    const mockConfig = {} as BackendConfig

    vi.mocked(useBackendConfigQuery).mockReturnValue(
      createMockQueryResult(mockConfig)
    )

    // Act
    const { result } = renderHook(() => useConfig(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.upscalers).toEqual([])
    expect(result.current.upscalerOptions).toEqual([])
    expect(result.current.safety_check_enabled).toBe(true)
  })
})

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfig } from '../useConfig'
import { useBackendConfigQuery } from '@/cores/api-queries'
import { createQueryClientWrapper } from '@/cores/test-utils/query-client'
import { createMockQueryResult } from '@/cores/test-utils/query-result-mock'
import { BackendConfig, UpscalerSection } from '@/types'
import { UpscalerMethod, UpscalerType } from '@/cores/constants'

vi.mock('@/cores/api-queries', () => ({
  useBackendConfigQuery: vi.fn()
}))

describe('useConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty arrays as default when query returns undefined', () => {
    // Arrange
    vi.mocked(useBackendConfigQuery).mockReturnValue(
      createMockQueryResult<BackendConfig>(undefined)
    )

    // Act
    const { result } = renderHook(() => useConfig(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.upscalers).toEqual([])
    expect(result.current.upscalerOptions).toEqual([])
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
      upscalers: mockUpscalerSections
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
  })

  it('should return empty arrays when config has no upscalers field', () => {
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
  })
})

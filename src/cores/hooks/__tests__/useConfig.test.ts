import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfig } from '../useConfig'
import { useBackendConfigQuery } from '@/cores/api-queries'
import { createQueryClientWrapper } from '@/cores/test-utils/query-client'
import { createMockQueryResult } from '@/cores/test-utils/query-result-mock'
import { BackendConfig, Upscaler } from '@/types'
import { UpscalerType } from '@/cores/constants'

vi.mock('@/cores/api-queries', () => ({
  useBackendConfigQuery: vi.fn()
}))

describe('useConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty array as default when query returns undefined', () => {
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
  })

  it('should return upscalers from the query data', () => {
    // Arrange
    const mockUpscalers: Upscaler[] = [
      {
        value: UpscalerType.LANCZOS,
        name: 'Lanczos',
        description: 'High quality upscaler',
        suggested_denoise_strength: 0.5
      },
      {
        value: UpscalerType.BICUBIC,
        name: 'Bicubic',
        description: 'Smooth upscaler',
        suggested_denoise_strength: 0.4
      }
    ]

    const mockConfig: BackendConfig = {
      upscalers: mockUpscalers
    }

    vi.mocked(useBackendConfigQuery).mockReturnValue(
      createMockQueryResult(mockConfig)
    )

    // Act
    const { result } = renderHook(() => useConfig(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.upscalers).toEqual(mockUpscalers)
  })

  it('should return empty array when config has no upscalers field', () => {
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
  })
})

import { useMemoryQuery } from '@/cores/api-queries'
import { formatter } from '@/services'
import { ApiError, MemoryResponse } from '@/types/api'
import { UseQueryResult } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MaxMemoryFormProps } from '../../types'
import { MaxMemoryScaleFactorPreview } from '../MaxMemoryScaleFactorPreview'

// Mock the services
vi.mock('@/cores/api-queries', () => ({
  useMemoryQuery: vi.fn()
}))

vi.mock('@/services/formatter', () => ({
  formatter: {
    bytes: vi.fn()
  }
}))

describe('MaxMemoryScaleFactorPreview', () => {
  const FormWrapper = ({
    children,
    defaultValues = { gpuScaleFactor: 0.6, ramScaleFactor: 0.6 }
  }: {
    children: React.ReactNode
    defaultValues?: MaxMemoryFormProps
  }) => {
    const methods = useForm<MaxMemoryFormProps>({
      defaultValues
    })

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  beforeEach(() => {
    vi.mocked(formatter.bytes).mockImplementation((bytes) => `${bytes} B`)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays a message when no data is available', () => {
    vi.mocked(useMemoryQuery).mockReturnValue(
      {} as UseQueryResult<MemoryResponse, ApiError>
    )

    render(
      <FormWrapper>
        <MaxMemoryScaleFactorPreview />
      </FormWrapper>
    )

    expect(
      screen.getByText('Select a memory option to see preview')
    ).toBeInTheDocument()
  })

  it('displays memory usage preview when data is available', () => {
    vi.mocked(useMemoryQuery).mockReturnValue({
      data: { gpu: 8000000000, ram: 16000000000 }
    } as UseQueryResult<MemoryResponse, ApiError>)

    render(
      <FormWrapper>
        <MaxMemoryScaleFactorPreview />
      </FormWrapper>
    )

    // Check if the title is displayed
    expect(screen.getByText('Memory Usage Preview')).toBeInTheDocument()

    // Check if GPU usage is displayed correctly (with scaling factor of 0.6)
    expect(formatter.bytes).toHaveBeenCalledWith(8000000000 * 0.6)
    expect(screen.getByText('GPU: 4800000000 B')).toBeInTheDocument()

    // Check if RAM usage is displayed correctly (with scaling factor of 0.6)
    expect(formatter.bytes).toHaveBeenCalledWith(16000000000 * 0.6)
    expect(screen.getByText('RAM: 9600000000 B')).toBeInTheDocument()
  })

  it('updates the preview when scale factor changes', () => {
    vi.mocked(useMemoryQuery).mockReturnValue({
      data: { gpu: 8000000000, ram: 16000000000 }
    } as UseQueryResult<MemoryResponse, ApiError>)

    const { rerender } = render(
      <FormWrapper>
        <MaxMemoryScaleFactorPreview />
      </FormWrapper>
    )

    // Initial render with default scale factor 0.6
    expect(formatter.bytes).toHaveBeenCalledWith(8000000000 * 0.6)
    expect(formatter.bytes).toHaveBeenCalledWith(16000000000 * 0.6)

    vi.mocked(formatter.bytes).mockClear()

    // Re-render with new GPU/RAM scale factors, forcing form remount via key
    rerender(
      <FormWrapper
        key="updated-values"
        defaultValues={{ gpuScaleFactor: 0.8, ramScaleFactor: 0.7 }}
      >
        <MaxMemoryScaleFactorPreview />
      </FormWrapper>
    )

    // Check if the calculations updated with the new scale factors
    expect(formatter.bytes).toHaveBeenCalledWith(8000000000 * 0.8)
    expect(formatter.bytes).toHaveBeenCalledWith(16000000000 * 0.7)
  })
})

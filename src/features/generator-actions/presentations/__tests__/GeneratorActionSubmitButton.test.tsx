import { useGenerationStatusStore } from '@/features/generators/states'
import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratorActionSubmitButton } from '../GeneratorActionSubmitButton'

// Mock the useGenerationStatusStore
vi.mock('@/features/generators/states', () => ({
  useGenerationStatusStore: vi.fn()
}))

// Mock react-hook-form's FormProvider
const FormProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      number_of_images: 4
    }
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('GeneratorActionSubmitButton', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render button with correct number of images', () => {
    // Arrange
    vi.mocked(useGenerationStatusStore).mockReturnValue({
      isGenerating: false,
      onSetIsGenerating: vi.fn(),
      reset: vi.fn()
    })

    // Act
    render(
      <FormProviderWrapper>
        <GeneratorActionSubmitButton />
      </FormProviderWrapper>
    )

    // Assert
    expect(screen.getByRole('button')).toHaveTextContent('Generate 4 images')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should show loading state when generating images', () => {
    // Arrange
    vi.mocked(useGenerationStatusStore).mockReturnValue({
      isGenerating: true,
      onSetIsGenerating: vi.fn(),
      reset: vi.fn()
    })

    // Act
    render(
      <FormProviderWrapper>
        <GeneratorActionSubmitButton />
      </FormProviderWrapper>
    )

    // Assert
    expect(screen.getByRole('button')).toHaveTextContent('Generating...')
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { GeneratorConfigQuantity } from '../GeneratorConfigQuantity'

// Mock the NumberInputController component
vi.mock('@/cores/presentations/NumberInputController', () => ({
  NumberInputController: ({
    'aria-label': ariaLabel,
    controlName,
    startContent,
    endContent
  }: {
    'aria-label': string
    controlName: string
    startContent: ReactNode
    endContent: ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid={`number-input-${controlName}`}>
      <span>{ariaLabel}</span>
      {startContent}
      <div data-testid="end-content">{endContent}</div>
    </div>
  )
}))

// Mock the Tooltip component from @heroui/react
vi.mock('@heroui/react', () => ({
  Tooltip: ({
    content,
    children
  }: {
    content: string
    children: ReactNode
  }) => (
    <div data-testid="tooltip" data-tooltip-content={content}>
      {children}
    </div>
  )
}))

const MockFormProvider = ({ children }: { children: ReactNode }) => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,

      number_of_images: 1,
      steps: 20,
      cfg_scale: 7,
      seed: 0
    }
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('GeneratorConfigQuantity', () => {
  it("should render the component with 'Quantity' heading", () => {
    render(
      <MockFormProvider>
        <GeneratorConfigQuantity />
      </MockFormProvider>
    )

    expect(screen.getByText('Quantity')).toBeInTheDocument()
  })

  it('should render number input for number_of_images', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigQuantity />
      </MockFormProvider>
    )

    expect(
      screen.getByTestId('number-input-number_of_images')
    ).toBeInTheDocument()
    expect(screen.getByText('Number of images')).toBeInTheDocument()
    expect(screen.getByText('Images')).toBeInTheDocument()
  })

  it('should render tooltip with correct content', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigQuantity />
      </MockFormProvider>
    )

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute(
      'data-tooltip-content',
      'Number of images will be generated'
    )
  })
})

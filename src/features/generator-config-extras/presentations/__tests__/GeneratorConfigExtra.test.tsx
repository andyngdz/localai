import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { GeneratorConfigExtra } from '../GeneratorConfigExtra'

// Mock the API queries
vi.mock('@/cores/api-queries', () => ({
  useLorasQuery: vi.fn(() => ({
    data: { loras: [] },
    isLoading: false,
    error: null
  }))
}))

const MockFormProvider = ({ children }: { children: ReactNode }) => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 1,
      steps: 20,
      cfg_scale: 7,
      clip_skip: 2,
      seed: 0,
      sampler: 'EULER_A',
      styles: [],
      loras: [],
      prompt: '',
      negative_prompt: ''
    }
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('GeneratorConfigExtra', () => {
  it('should render the component with the correct header', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigExtra />
      </MockFormProvider>
    )

    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('should render the add button', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigExtra />
      </MockFormProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should render the Plus icon in the button', () => {
    const { container } = render(
      <MockFormProvider>
        <GeneratorConfigExtra />
      </MockFormProvider>
    )

    const iconElement = container.querySelector('svg')
    expect(iconElement).toBeInTheDocument()
  })

  it('should render the button as iconOnly', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigExtra />
      </MockFormProvider>
    )

    const button = screen.getByRole('button')
    expect(button).not.toHaveTextContent(/\S/)
  })
})

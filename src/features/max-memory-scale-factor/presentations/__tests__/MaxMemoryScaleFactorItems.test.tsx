import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { MaxMemoryFormProps } from '../../types'
import { MaxMemoryScaleFactorItems } from '../MaxMemoryScaleFactorItems'

// Mock the MaxMemoryScaleFactorItem component
vi.mock('../MaxMemoryScaleFactorItem', () => ({
  MaxMemoryScaleFactorItem: ({ fieldName }: { fieldName: string }) => (
    <div data-testid={`memory-slider-${fieldName}`}>Slider {fieldName}</div>
  )
}))

describe('MaxMemoryScaleFactorItems', () => {
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<MaxMemoryFormProps>({
      defaultValues: { gpuScaleFactor: 0.5, ramScaleFactor: 0.5 }
    })

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  it('renders GPU and RAM sliders', () => {
    render(
      <FormWrapper>
        <MaxMemoryScaleFactorItems />
      </FormWrapper>
    )

    expect(
      screen.getByTestId('memory-slider-gpuScaleFactor')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('memory-slider-ramScaleFactor')
    ).toBeInTheDocument()
  })

  it('wraps sliders in layout container', () => {
    render(
      <FormWrapper>
        <MaxMemoryScaleFactorItems />
      </FormWrapper>
    )

    const container = screen.getByTestId('memory-scale-factor-sliders')
    expect(container).toBeInTheDocument()
  })
})

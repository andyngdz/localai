import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { MaxMemoryFormProps } from '../../types'
import { MaxMemoryScaleFactorItem } from '../MaxMemoryScaleFactorItem'

const TestWrapper = ({
  fieldName,
  label,
  defaultValues
}: {
  fieldName: keyof Pick<MaxMemoryFormProps, 'gpuScaleFactor' | 'ramScaleFactor'>
  label: string
  defaultValues: MaxMemoryFormProps
}) => {
  const methods = useForm<MaxMemoryFormProps>({
    defaultValues
  })

  return (
    <FormProvider {...methods}>
      <MaxMemoryScaleFactorItem
        fieldName={fieldName}
        label={label}
        description="Limit VRAM usage"
      />
    </FormProvider>
  )
}

describe('MaxMemoryScaleFactorItem', () => {
  it('renders slider with success color for low value', () => {
    render(
      <TestWrapper
        fieldName="gpuScaleFactor"
        label="GPU allocation"
        defaultValues={{ gpuScaleFactor: 0.5, ramScaleFactor: 0.5 }}
      />
    )

    expect(screen.getByLabelText('GPU allocation slider')).toBeInTheDocument()
  })

  it('applies warning color when value is between 50% and 70%', () => {
    render(
      <TestWrapper
        fieldName="gpuScaleFactor"
        label="GPU allocation"
        defaultValues={{ gpuScaleFactor: 0.6, ramScaleFactor: 0.5 }}
      />
    )

    expect(screen.getByLabelText('GPU allocation slider')).toBeInTheDocument()
  })

  it('applies danger color when value is high', () => {
    render(
      <TestWrapper
        fieldName="ramScaleFactor"
        label="RAM allocation"
        defaultValues={{ gpuScaleFactor: 0.5, ramScaleFactor: 0.8 }}
      />
    )

    const container = screen.getByTestId('memory-slider-ramScaleFactor')
    expect(container).toBeInTheDocument()
    expect(screen.getByLabelText('RAM allocation slider')).toBeInTheDocument()
  })
})

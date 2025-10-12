import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import { COMMON_STEPS } from '../../constants'
import { GeneratorConfigCommonSteps } from '../GeneratorConfigCommonSteps'

// Mock constants to test with
vi.mock('../../constants', () => ({
  COMMON_STEPS: [16, 24, 32]
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
      seed: 0
    }
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('GeneratorConfigCommonSteps', () => {
  it('should render buttons for each common step value', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigCommonSteps />
      </MockFormProvider>
    )

    // Check that all buttons from COMMON_STEPS are rendered
    COMMON_STEPS.forEach((step) => {
      expect(
        screen.getByRole('button', { name: step.toString() })
      ).toBeInTheDocument()
    })
  })

  it('should call setValue with correct step value when button is pressed', async () => {
    const user = userEvent.setup()
    const mockSetValue = vi.fn()

    // Create custom FormProvider with mock setValue
    const CustomMockFormProvider = ({ children }: { children: ReactNode }) => {
      const methods = useForm<GeneratorConfigFormValues>({
        defaultValues: {
          width: 512,
          height: 512,
          hires_fix: false,
          number_of_images: 1,
          steps: 20,
          cfg_scale: 7,
          seed: 0
        }
      })

      // Override setValue with mock function
      methods.setValue = mockSetValue

      return <FormProvider {...methods}>{children}</FormProvider>
    }

    render(
      <CustomMockFormProvider>
        <GeneratorConfigCommonSteps />
      </CustomMockFormProvider>
    )

    // Click on the first button (16)
    const firstStepButton = screen.getByRole('button', { name: '16' })
    await user.click(firstStepButton)

    // Verify setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith('steps', 16)

    // Click on the third button (32)
    const thirdStepButton = screen.getByRole('button', { name: '32' })
    await user.click(thirdStepButton)

    // Verify setValue was called with correct parameters
    expect(mockSetValue).toHaveBeenCalledWith('steps', 32)
  })

  it('should render buttons with light variant and proper styling', () => {
    render(
      <MockFormProvider>
        <GeneratorConfigCommonSteps />
      </MockFormProvider>
    )

    // Get all buttons
    const buttons = screen.getAllByRole('button')

    // Check number of buttons matches COMMON_STEPS length
    expect(buttons).toHaveLength(COMMON_STEPS.length)

    // Check each button has the light variant class
    buttons.forEach((button) => {
      expect(button).toHaveAttribute(
        'class',
        expect.stringContaining('text-default-700')
      )
    })
  })
})

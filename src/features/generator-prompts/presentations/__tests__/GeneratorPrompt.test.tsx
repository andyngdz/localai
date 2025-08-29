import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratorPrompt } from '../GeneratorPrompt'
import { useFormContext } from 'react-hook-form'
import type { UseFormReturn, FieldValues } from 'react-hook-form'

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn().mockImplementation((hasErrors = false) => {
    // Using type assertion to avoid complex type matching issues
    return {
      register: vi.fn(),
      formState: {
        errors: hasErrors ? { prompt: { type: 'required', message: 'Required' } } : {}
      },
      watch: vi.fn()
    } as unknown as UseFormReturn<FieldValues>
  })
}))

// Mock @heroui/input
vi.mock('@heroui/input', () => ({
  Textarea: ({
    label,
    className,
    name,
    maxLength,
    isInvalid,
    value
  }: {
    label: string
    className: string
    value?: string
    onChange?: () => void
    onBlur?: () => void
    name?: string
    maxLength?: number
    isInvalid?: boolean
  }) => (
    <div
      data-testid={sanitizeLabelTestId(label)}
      className={className}
      data-name={name}
      data-maxlength={maxLength}
      data-invalid={isInvalid ? 'true' : 'false'}
      data-value={value}
    >
      {label} Mock
    </div>
  )
}))

// Helper to make test id generation explicit and easier to read
function sanitizeLabelTestId(label: string) {
  return `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`
}

// useFormContext is already imported at the top

describe('GeneratorPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render prompt and negative prompt text areas', () => {
    render(<GeneratorPrompt />)

    // Check if the text areas are rendered
    const promptTextarea = screen.getByTestId('textarea-prompt')
    const negativePromptTextarea = screen.getByTestId('textarea-negative-prompt')

    expect(promptTextarea).toBeInTheDocument()
    expect(promptTextarea).toHaveClass('font-mono')
    expect(promptTextarea).toHaveTextContent('Prompt Mock')
    expect(promptTextarea).toHaveAttribute('data-invalid', 'false')

    expect(negativePromptTextarea).toBeInTheDocument()
    expect(negativePromptTextarea).toHaveClass('font-mono')
    expect(negativePromptTextarea).toHaveTextContent('Negative prompt Mock')
    expect(negativePromptTextarea).toHaveAttribute('data-invalid', 'false')
  })

  it('should render error state when there are errors', () => {
    vi.mocked(useFormContext).mockImplementation(
      () =>
        ({
          register: vi.fn(),
          formState: {
            errors: { prompt: { type: 'required', message: 'Required' } }
          },
          watch: vi.fn()
        }) as unknown as UseFormReturn<FieldValues>
    )

    render(<GeneratorPrompt />)

    // Use data-testid to find the textarea elements
    const promptTextarea = screen.getByTestId('textarea-prompt')
    const negativePromptTextarea = screen.getByTestId('textarea-negative-prompt')

    // Verify prompt textarea has error state
    expect(promptTextarea).toBeInTheDocument()
    expect(promptTextarea).toHaveAttribute('data-invalid', 'true')

    // Verify negative prompt doesn't have error state
    expect(negativePromptTextarea).toBeInTheDocument()
    expect(negativePromptTextarea).toHaveAttribute('data-invalid', 'false')
  })

  it('should pass maxLength to Textarea components', () => {
    render(<GeneratorPrompt />)

    const promptTextarea = screen.getByText('Prompt Mock')
    const negativePromptTextarea = screen.getByText('Negative prompt Mock')

    expect(promptTextarea).toHaveAttribute('data-maxlength', '1000')
    expect(negativePromptTextarea).toHaveAttribute('data-maxlength', '1000')
  })
})

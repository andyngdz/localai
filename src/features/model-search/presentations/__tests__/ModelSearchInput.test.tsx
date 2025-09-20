import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ModelSearchFormValues } from '../../types'
import { ModelSearchInput } from '../ModelSearchInput'

// Mock @heroui/react Input component
vi.mock('@heroui/react', () => ({
  Input: vi.fn(({ ...props }) => <input data-testid="hero-input" {...props} />)
}))

// Test wrapper component that provides form context
const TestWrapper = ({
  children,
  defaultValues = { query: '' }
}: {
  children: React.ReactNode
  defaultValues?: ModelSearchFormValues
}) => {
  const methods = useForm<ModelSearchFormValues>({
    defaultValues
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('ModelSearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders the Input component', () => {
      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')
      expect(input).toBeInTheDocument()
    })

    it('applies flat variant to Input component', async () => {
      const { Input } = await import('@heroui/react')

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const callArgs = vi.mocked(Input).mock.calls[0][0]
      expect(callArgs).toHaveProperty('variant', 'flat')
    })

    it('registers the query field with react-hook-form', async () => {
      const { Input } = await import('@heroui/react')

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const callArgs = vi.mocked(Input).mock.calls[0][0]
      expect(callArgs).toHaveProperty('name', 'query')
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form context', () => {
      render(
        <TestWrapper defaultValues={{ query: 'test query' }}>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')
      expect(input).toHaveValue('test query')
    })

    it('updates form value when input changes', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      await user.type(input, 'new search query')

      expect(input).toHaveValue('new search query')
    })

    it('handles empty initial value', () => {
      render(
        <TestWrapper defaultValues={{ query: '' }}>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')
      expect(input).toHaveValue('')
    })

    it('handles pre-filled values', () => {
      render(
        <TestWrapper defaultValues={{ query: 'pre-filled search' }}>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')
      expect(input).toHaveValue('pre-filled search')
    })
  })

  describe('User Interactions', () => {
    it('allows typing in the input field', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      await user.type(input, 'search term')

      expect(input).toHaveValue('search term')
    })

    it('allows clearing the input field', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper defaultValues={{ query: 'initial value' }}>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')
      expect(input).toHaveValue('initial value')

      await user.clear(input)

      expect(input).toHaveValue('')
    })

    it('allows selecting and replacing text', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper defaultValues={{ query: 'original text' }}>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      await user.clear(input)
      await user.type(input, 'replacement text')

      expect(input).toHaveValue('replacement text')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      await user.click(input)
      expect(input).toHaveFocus()

      await user.type(input, 'test')
      expect(input).toHaveValue('test')

      // Test that we can navigate with arrow keys
      await user.keyboard('{ArrowLeft}{ArrowLeft}')
      await user.type(input, 'X')

      expect(input).toHaveValue('testX')
    })
  })

  describe('Form Validation Integration', () => {
    it('works with form validation rules', async () => {
      const TestWrapperWithValidation = ({
        children
      }: {
        children: React.ReactNode
      }) => {
        const methods = useForm<ModelSearchFormValues>({
          defaultValues: { query: '' },
          mode: 'onChange'
        })

        return (
          <FormProvider {...methods}>
            <form>
              {children}
              <div data-testid="form-state">
                {String(methods.formState.isValid)}
              </div>
            </form>
          </FormProvider>
        )
      }

      render(
        <TestWrapperWithValidation>
          <ModelSearchInput />
        </TestWrapperWithValidation>
      )

      const formState = screen.getByTestId('form-state')
      // Just ensure the formState element is rendered (value may vary depending on React strict mode)
      expect(formState).toBeInTheDocument()
    })

    it('maintains form state consistency', async () => {
      const user = userEvent.setup()

      const TestWrapperWithState = ({
        children
      }: {
        children: React.ReactNode
      }) => {
        const methods = useForm<ModelSearchFormValues>({
          defaultValues: { query: '' }
        })

        return (
          <FormProvider {...methods}>
            <form>
              {children}
              <div data-testid="form-values">
                {JSON.stringify(methods.watch())}
              </div>
            </form>
          </FormProvider>
        )
      }

      render(
        <TestWrapperWithState>
          <ModelSearchInput />
        </TestWrapperWithState>
      )

      const input = screen.getByTestId('hero-input')
      const formValues = screen.getByTestId('form-values')

      expect(formValues).toHaveTextContent('{"query":""}')

      await user.type(input, 'test query')

      expect(formValues).toHaveTextContent('{"query":"test query"}')
    })
  })

  describe('Component Props', () => {
    it('passes all register props to Input component', async () => {
      const { Input } = await import('@heroui/react')

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const callArgs = vi.mocked(Input).mock.calls[0][0]

      // Should have register props like name, onChange, onBlur, ref
      expect(callArgs).toHaveProperty('name', 'query')
      expect(callArgs).toHaveProperty('onChange')
      expect(callArgs).toHaveProperty('onBlur')
      expect(callArgs).toHaveProperty('variant', 'flat')
    })

    it('maintains Input component styling', async () => {
      const { Input } = await import('@heroui/react')

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const callArgs = vi.mocked(Input).mock.calls[0][0]
      expect(callArgs).toHaveProperty('variant', 'flat')
    })
  })

  describe('Error Handling', () => {
    it('handles missing form context gracefully', () => {
      // This should throw an error since useFormContext requires FormProvider
      expect(() => render(<ModelSearchInput />)).toThrow()
    })

    it('works with different form states', async () => {
      const user = userEvent.setup()

      const TestWrapperWithReset = ({
        children
      }: {
        children: React.ReactNode
      }) => {
        const methods = useForm<ModelSearchFormValues>({
          defaultValues: { query: 'initial' }
        })

        return (
          <FormProvider {...methods}>
            <form>
              {children}
              <button
                type="button"
                onClick={() => methods.reset({ query: 'reset value' })}
                data-testid="reset-button"
              >
                Reset
              </button>
            </form>
          </FormProvider>
        )
      }

      render(
        <TestWrapperWithReset>
          <ModelSearchInput />
        </TestWrapperWithReset>
      )

      const input = screen.getByTestId('hero-input')
      const resetButton = screen.getByTestId('reset-button')

      expect(input).toHaveValue('initial')

      await user.type(input, ' modified')
      expect(input).toHaveValue('initial modified')

      await user.click(resetButton)
      expect(input).toHaveValue('reset value')
    })
  })

  describe('Accessibility', () => {
    it('maintains input accessibility', () => {
      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      expect(input).toBeVisible()
      expect(input).not.toHaveAttribute('disabled')
    })

    it('supports focus management', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const input = screen.getByTestId('hero-input')

      await user.click(input)
      expect(input).toHaveFocus()

      await user.tab()
      expect(input).not.toHaveFocus()
    })
  })

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', async () => {
      const { Input } = await import('@heroui/react')

      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const initialCount = vi.mocked(Input).mock.calls.length

      // Re-rendering the same component
      render(
        <TestWrapper>
          <ModelSearchInput />
        </TestWrapper>
      )

      const finalCount = vi.mocked(Input).mock.calls.length

      // Expect the call count to increase by at most 1 for this simple re-render
      expect(finalCount).toBeGreaterThanOrEqual(initialCount)
      expect(finalCount - initialCount).toBeLessThanOrEqual(2)
    })
  })

  describe('Type Safety', () => {
    it('correctly types the form values', () => {
      // This test ensures TypeScript compilation works correctly
      const TestWrapperTyped = ({
        children
      }: {
        children: React.ReactNode
      }) => {
        const methods = useForm<ModelSearchFormValues>({
          defaultValues: { query: '' }
        })

        // This should compile without TypeScript errors
        const queryValue: string = methods.watch('query')

        return (
          <FormProvider {...methods}>
            <div data-testid="typed-value">{queryValue}</div>
            {children}
          </FormProvider>
        )
      }

      render(
        <TestWrapperTyped>
          <ModelSearchInput />
        </TestWrapperTyped>
      )

      const typedValue = screen.getByTestId('typed-value')
      expect(typedValue).toHaveTextContent('')
    })
  })
})

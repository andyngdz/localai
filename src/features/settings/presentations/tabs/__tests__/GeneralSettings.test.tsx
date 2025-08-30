import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneralSettings } from '../GeneralSettings'
import { useGeneralSettings } from '../../../states/useGeneralSettings'

// Mock the useGeneralSettings hook
vi.mock('../../../states/useGeneralSettings', () => ({
  useGeneralSettings: vi.fn()
}))

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
  Input: ({
    label,
    placeholder,
    fullWidth,
    onChange,
    value,
    name,
    ...props
  }: {
    label: string
    placeholder: string
    fullWidth?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
    name?: string
  }) => (
    <div data-testid="input-wrapper">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        data-testid="input-field"
        placeholder={placeholder}
        data-fullwidth={fullWidth}
        onChange={onChange}
        value={value}
        name={name}
        {...props}
      />
    </div>
  ),
  Switch: ({
    children,
    onChange,
    checked,
    name,
    ...props
  }: {
    children: React.ReactNode
    onChange?: (checked: boolean) => void
    checked?: boolean
    name?: string
  }) => (
    <label data-testid="switch-wrapper">
      <input
        data-testid="switch-input"
        type="checkbox"
        onChange={(e) => onChange?.(e.target.checked)}
        checked={checked}
        name={name}
        {...props}
      />
      <span>{children}</span>
    </label>
  )
}))

describe('GeneralSettings', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    vi.mocked(useGeneralSettings).mockReturnValue({
      register: mockRegister
    })

    // Mock register function to return form registration props
    mockRegister.mockImplementation((fieldName: string) => ({
      name: fieldName,
      onChange: vi.fn(),
      value: fieldName === 'baseUrl' ? 'http://localhost:8000' : false
    }))
  })

  describe('component rendering', () => {
    it('renders without crashing', () => {
      render(<GeneralSettings />)

      expect(screen.getByText('API Base URL')).toBeInTheDocument()
      expect(screen.getByText('Safety check')).toBeInTheDocument()
    })

    it('has correct container structure and styling', () => {
      render(<GeneralSettings />)

      const container = screen.getByText('API Base URL').closest('div')?.parentElement
      expect(container).toHaveClass('flex', 'flex-col', 'gap-8')
    })
  })

  describe('API Base URL input', () => {
    it('renders input with correct label and placeholder', () => {
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      expect(screen.getByLabelText('API Base URL')).toBeInTheDocument()
      expect(input).toHaveAttribute('placeholder', 'Enter API base URL')
    })

    it('sets input as full width', () => {
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      expect(input).toHaveAttribute('data-fullwidth', 'true')
    })

    it('registers the baseUrl field correctly', () => {
      render(<GeneralSettings />)

      expect(mockRegister).toHaveBeenCalledWith('baseUrl')
    })

    it('spreads register props to Input component', () => {
      const mockRegisterProps = {
        name: 'baseUrl',
        onChange: vi.fn(),
        value: 'http://localhost:8000'
      }
      mockRegister.mockReturnValue(mockRegisterProps)

      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      expect(input).toHaveAttribute('name', 'baseUrl')
      expect(input).toHaveValue('http://localhost:8000')
    })

    it('handles input changes through register', async () => {
      const mockOnChange = vi.fn()
      mockRegister.mockReturnValue({
        name: 'baseUrl',
        onChange: mockOnChange,
        value: ''
      })

      const user = userEvent.setup()
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      await user.type(input, 'http://new-url.com')

      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Safety Check switch', () => {
    it('renders switch with correct label', () => {
      render(<GeneralSettings />)

      const switchElement = screen.getByTestId('switch-input')
      const label = switchElement.closest('[data-testid="switch-wrapper"]')
      expect(label).toHaveTextContent('Safety check')
    })

    it('registers the safetyCheck field correctly', () => {
      render(<GeneralSettings />)

      expect(mockRegister).toHaveBeenCalledWith('safetyCheck')
    })

    it('spreads register props to Switch component', () => {
      const mockRegisterProps = {
        name: 'safetyCheck',
        onChange: vi.fn(),
        checked: true
      }
      mockRegister.mockReturnValue(mockRegisterProps)

      render(<GeneralSettings />)

      const switchInput = screen.getByTestId('switch-input')
      expect(switchInput).toHaveAttribute('name', 'safetyCheck')
      expect(switchInput).toBeChecked()
    })

    it('handles switch changes through register', async () => {
      const mockOnChange = vi.fn()
      mockRegister.mockReturnValue({
        name: 'safetyCheck',
        onChange: mockOnChange,
        checked: false
      })

      const user = userEvent.setup()
      render(<GeneralSettings />)

      const switchInput = screen.getByTestId('switch-input')
      await user.click(switchInput)

      expect(mockOnChange).toHaveBeenCalled()
    })

    it('reflects different checked states', () => {
      // Test unchecked state
      mockRegister.mockImplementation((fieldName: string) => ({
        name: fieldName,
        onChange: vi.fn(),
        checked: fieldName === 'safetyCheck' ? false : undefined
      }))

      render(<GeneralSettings />)

      const switchInput = screen.getByTestId('switch-input')
      expect(switchInput).not.toBeChecked()
    })
  })

  describe('form integration', () => {
    it('calls useGeneralSettings hook', () => {
      render(<GeneralSettings />)

      expect(useGeneralSettings).toHaveBeenCalled()
    })

    it('uses register function from useGeneralSettings', () => {
      render(<GeneralSettings />)

      expect(mockRegister).toHaveBeenCalledTimes(2)
      expect(mockRegister).toHaveBeenCalledWith('baseUrl')
      expect(mockRegister).toHaveBeenCalledWith('safetyCheck')
    })

    it('handles register function returning different props', () => {
      // Mock different register implementations for different fields
      mockRegister.mockImplementation((fieldName: string) => {
        if (fieldName === 'baseUrl') {
          return {
            name: 'baseUrl',
            onChange: vi.fn(),
            value: 'custom-url.com',
            required: true
          }
        }
        if (fieldName === 'safetyCheck') {
          return {
            name: 'safetyCheck',
            onChange: vi.fn(),
            checked: true,
            disabled: false
          }
        }
        return {}
      })

      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      const switchInput = screen.getByTestId('switch-input')

      expect(input).toHaveAttribute('name', 'baseUrl')
      expect(input).toHaveValue('custom-url.com')
      expect(switchInput).toHaveAttribute('name', 'safetyCheck')
      expect(switchInput).toBeChecked()
    })
  })

  describe('component structure and layout', () => {
    it('renders input before switch in DOM order', () => {
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-wrapper')
      const switchWrapper = screen.getByTestId('switch-wrapper')

      expect(
        input.compareDocumentPosition(switchWrapper) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })

    it('maintains consistent gap between form elements', () => {
      render(<GeneralSettings />)

      const container = screen.getByText('API Base URL').closest('div')?.parentElement
      expect(container).toHaveClass('gap-8')
    })

    it('uses flexbox layout correctly', () => {
      render(<GeneralSettings />)

      const container = screen.getByText('API Base URL').closest('div')?.parentElement
      expect(container).toHaveClass('flex', 'flex-col')
    })
  })

  describe('accessibility', () => {
    it('provides proper labels for form elements', () => {
      render(<GeneralSettings />)

      expect(screen.getByLabelText('API Base URL')).toBeInTheDocument()

      const switchInput = screen.getByTestId('switch-input')
      const switchLabel = switchInput.closest('label')
      expect(switchLabel).toHaveTextContent('Safety check')
    })

    it('maintains form element associations', () => {
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      expect(input).toHaveAttribute('name', 'baseUrl')

      const switchInput = screen.getByTestId('switch-input')
      expect(switchInput).toHaveAttribute('name', 'safetyCheck')
    })
  })

  describe('error handling', () => {
    it('handles missing register function gracefully', () => {
      // Mock console.error to suppress expected error logs during testing
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(useGeneralSettings).mockReturnValue({
        register: undefined as unknown as typeof mockRegister
      })

      // The component will throw when trying to call register, which is expected
      expect(() => render(<GeneralSettings />)).toThrow('register is not a function')

      consoleSpy.mockRestore()
    })

    it('handles register returning undefined', () => {
      mockRegister.mockReturnValue(undefined)

      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      const switchInput = screen.getByTestId('switch-input')

      expect(input).toBeInTheDocument()
      expect(switchInput).toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      const switchInput = screen.getByTestId('switch-input')

      // Tab to input
      await user.tab()
      expect(input).toHaveFocus()

      // Tab to switch
      await user.tab()
      expect(switchInput).toHaveFocus()
    })

    it('handles complex user workflows', async () => {
      const mockInputChange = vi.fn()
      const mockSwitchChange = vi.fn()

      mockRegister.mockImplementation((fieldName: string) => ({
        name: fieldName,
        onChange: fieldName === 'baseUrl' ? mockInputChange : mockSwitchChange,
        value: fieldName === 'baseUrl' ? '' : undefined,
        checked: fieldName === 'safetyCheck' ? false : undefined
      }))

      const user = userEvent.setup()
      render(<GeneralSettings />)

      const input = screen.getByTestId('input-field')
      const switchInput = screen.getByTestId('switch-input')

      // Type in input field
      await user.type(input, 'http://test.com')

      // Toggle switch
      await user.click(switchInput)

      expect(mockInputChange).toHaveBeenCalled()
      expect(mockSwitchChange).toHaveBeenCalled()
    })
  })
})

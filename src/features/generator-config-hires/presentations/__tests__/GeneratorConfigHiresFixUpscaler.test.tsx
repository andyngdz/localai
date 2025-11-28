import { UpscalerType } from '@/cores/constants'
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UseFormReturn } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratorConfigHiresFixUpscaler } from '../GeneratorConfigHiresFixUpscaler'

// Mock HeroUI components
vi.mock('@heroui/react', () => {
  // Inline the upscalers for the mock
  const upscalers = [
    { value: 'Lanczos', label: 'Lanczos (Highest Quality)' },
    { value: 'Bicubic', label: 'Bicubic (High Quality)' },
    { value: 'Bilinear', label: 'Bilinear (Balanced)' },
    { value: 'Nearest', label: 'Nearest (Fastest)' }
  ]

  return {
    Select: ({
      label,
      selectedKeys,
      onSelectionChange,
      'aria-label': ariaLabel
    }: {
      label: string
      selectedKeys: string[]
      onSelectionChange: (keys: { currentKey: string | null }) => void
      children: React.ReactNode
      'aria-label': string
    }) => {
      return (
        <div data-testid="select" aria-label={ariaLabel}>
          <label>{label}</label>
          <select
            data-testid="select-input"
            value={selectedKeys?.[0] || ''}
            onChange={(e) =>
              onSelectionChange({ currentKey: e.target.value || null })
            }
          >
            {upscalers.map((upscaler) => (
              <option key={upscaler.value} value={upscaler.value}>
                {upscaler.label}
              </option>
            ))}
          </select>
        </div>
      )
    },
    SelectItem: () => null,
    Skeleton: ({ className }: { className: string }) => (
      <div data-testid="skeleton" className={className}>
        Loading...
      </div>
    )
  }
})

// Mock constants
vi.mock('../../constants', () => ({
  UPSCALERS: [
    { value: 'Lanczos', label: 'Lanczos (Highest Quality)' },
    { value: 'Bicubic', label: 'Bicubic (High Quality)' },
    { value: 'Bilinear', label: 'Bilinear (Balanced)' },
    { value: 'Nearest', label: 'Nearest (Fastest)' }
  ]
}))

// Mock react-hook-form
const mockOnChange = vi.fn()
const mockControl = {} as UseFormReturn<GeneratorConfigFormValues>['control']
let mockFieldValue: string | undefined = UpscalerType.LANCZOS

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    control: mockControl
  }),
  Controller: ({
    render
  }: {
    render: (props: {
      field: { value: string | undefined; onChange: (v: string) => void }
    }) => React.ReactNode
  }) => {
    const mockField = {
      value: mockFieldValue,
      onChange: mockOnChange
    }
    return <>{render({ field: mockField })}</>
  }
}))

describe('GeneratorConfigHiresFixUpscaler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFieldValue = UpscalerType.LANCZOS
  })

  it('renders without crashing', () => {
    render(<GeneratorConfigHiresFixUpscaler />)
  })

  it('renders select with correct label', () => {
    render(<GeneratorConfigHiresFixUpscaler />)

    expect(screen.getByText('Upscaler')).toBeInTheDocument()
  })

  it('renders select with correct aria-label', () => {
    render(<GeneratorConfigHiresFixUpscaler />)

    expect(screen.getByLabelText('Upscaler')).toBeInTheDocument()
  })

  it('displays all upscaler options', () => {
    render(<GeneratorConfigHiresFixUpscaler />)

    expect(screen.getByText('Lanczos (Highest Quality)')).toBeInTheDocument()
    expect(screen.getByText('Bicubic (High Quality)')).toBeInTheDocument()
    expect(screen.getByText('Bilinear (Balanced)')).toBeInTheDocument()
    expect(screen.getByText('Nearest (Fastest)')).toBeInTheDocument()
  })

  it('displays selected value', () => {
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input') as HTMLSelectElement

    expect(select.value).toBe(UpscalerType.LANCZOS)
  })

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    await user.selectOptions(select, UpscalerType.BICUBIC)

    expect(mockOnChange).toHaveBeenCalledWith(UpscalerType.BICUBIC)
  })

  it('passes string value directly on change', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    await user.selectOptions(select, UpscalerType.BILINEAR)

    expect(mockOnChange).toHaveBeenCalledWith(UpscalerType.BILINEAR)
    expect(typeof mockOnChange.mock.calls[0][0]).toBe('string')
  })

  it('handles selection of each upscaler type', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    await user.selectOptions(select, UpscalerType.LANCZOS)
    expect(mockOnChange).toHaveBeenLastCalledWith(UpscalerType.LANCZOS)

    await user.selectOptions(select, UpscalerType.BICUBIC)
    expect(mockOnChange).toHaveBeenLastCalledWith(UpscalerType.BICUBIC)

    await user.selectOptions(select, UpscalerType.BILINEAR)
    expect(mockOnChange).toHaveBeenLastCalledWith(UpscalerType.BILINEAR)

    await user.selectOptions(select, UpscalerType.NEAREST)
    expect(mockOnChange).toHaveBeenLastCalledWith(UpscalerType.NEAREST)
  })

  describe('skeleton state', () => {
    it('shows skeleton when value is undefined', () => {
      mockFieldValue = undefined
      render(<GeneratorConfigHiresFixUpscaler />)

      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
      expect(screen.queryByTestId('select')).not.toBeInTheDocument()
    })

    it('skeleton has correct class', () => {
      mockFieldValue = undefined
      render(<GeneratorConfigHiresFixUpscaler />)
      const skeleton = screen.getByTestId('skeleton')

      expect(skeleton).toHaveClass('h-14', 'rounded-medium')
    })
  })

  it('only calls onChange when valid key is selected', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    // Select a valid option
    await user.selectOptions(select, UpscalerType.NEAREST)

    // Should call onChange with the string
    expect(mockOnChange).toHaveBeenCalledWith(UpscalerType.NEAREST)
  })

  it('renders options in correct quality order', () => {
    const { container } = render(<GeneratorConfigHiresFixUpscaler />)
    const options = container.querySelectorAll('option')

    expect(options[0].textContent).toBe('Lanczos (Highest Quality)')
    expect(options[1].textContent).toBe('Bicubic (High Quality)')
    expect(options[2].textContent).toBe('Bilinear (Balanced)')
    expect(options[3].textContent).toBe('Nearest (Fastest)')
  })
})

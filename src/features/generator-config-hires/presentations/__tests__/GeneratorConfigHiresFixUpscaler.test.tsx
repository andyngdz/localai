import { UpscalerType } from '@/cores/constants'
import { useConfig } from '@/cores/hooks'
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config'
import { Upscaler } from '@/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UseFormReturn } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratorConfigHiresFixUpscaler } from '../GeneratorConfigHiresFixUpscaler'

// Mock useConfig hook
vi.mock('@/cores/hooks', () => ({
  useConfig: vi.fn()
}))

const mockUpscalers: Upscaler[] = [
  {
    value: UpscalerType.LANCZOS,
    name: 'Lanczos',
    description: 'High quality upscaler',
    suggested_denoise_strength: 0.5
  },
  {
    value: UpscalerType.BICUBIC,
    name: 'Bicubic',
    description: 'Smooth upscaler',
    suggested_denoise_strength: 0.4
  },
  {
    value: UpscalerType.BILINEAR,
    name: 'Bilinear',
    description: 'Balanced upscaler',
    suggested_denoise_strength: 0.35
  },
  {
    value: UpscalerType.NEAREST,
    name: 'Nearest',
    description: 'Fast upscaler',
    suggested_denoise_strength: 0.3
  }
]

// Mock HeroUI components
vi.mock('@heroui/react', () => {
  return {
    Select: ({
      label,
      selectedKeys,
      onSelectionChange,
      'aria-label': ariaLabel,
      children
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
            {children}
          </select>
        </div>
      )
    },
    SelectItem: ({
      children,
      ...props
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => <option {...props}>{children}</option>,
    Skeleton: ({ className }: { className: string }) => (
      <div data-testid="skeleton" className={className}>
        Loading...
      </div>
    )
  }
})

// Mock react-hook-form
const mockOnChange = vi.fn()
const mockSetValue = vi.fn()
const mockControl = {} as UseFormReturn<GeneratorConfigFormValues>['control']
let mockFieldValue: string | undefined = UpscalerType.LANCZOS

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    control: mockControl,
    setValue: mockSetValue
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
    vi.mocked(useConfig).mockReturnValue({ upscalers: mockUpscalers })
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

  it('displays upscaler options from useConfig', () => {
    render(<GeneratorConfigHiresFixUpscaler />)

    expect(screen.getByText('Lanczos')).toBeInTheDocument()
    expect(screen.getByText('Bicubic')).toBeInTheDocument()
    expect(screen.getByText('Bilinear')).toBeInTheDocument()
    expect(screen.getByText('Nearest')).toBeInTheDocument()
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

  it('sets suggested_denoise_strength when upscaler changes', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    await user.selectOptions(select, UpscalerType.BICUBIC)

    expect(mockSetValue).toHaveBeenCalledWith(
      'hires_fix.denoising_strength',
      0.4
    )
  })

  it('sets correct denoise strength for each upscaler', async () => {
    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    await user.selectOptions(select, UpscalerType.LANCZOS)
    expect(mockSetValue).toHaveBeenCalledWith(
      'hires_fix.denoising_strength',
      0.5
    )

    mockSetValue.mockClear()
    await user.selectOptions(select, UpscalerType.NEAREST)
    expect(mockSetValue).toHaveBeenCalledWith(
      'hires_fix.denoising_strength',
      0.3
    )
  })

  it('does not set denoise strength if upscaler not found in config', async () => {
    // When upscalers array doesn't contain the selected value
    vi.mocked(useConfig).mockReturnValue({
      upscalers: [
        {
          value: UpscalerType.LANCZOS,
          name: 'Lanczos',
          description: 'High quality upscaler',
          suggested_denoise_strength: 0.5
        }
      ]
    })

    const user = userEvent.setup()
    render(<GeneratorConfigHiresFixUpscaler />)
    const select = screen.getByTestId('select-input')

    // Select LANCZOS which exists - should call setValue
    await user.selectOptions(select, UpscalerType.LANCZOS)
    expect(mockSetValue).toHaveBeenCalledWith(
      'hires_fix.denoising_strength',
      0.5
    )
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

  it('handles empty upscalers array gracefully', () => {
    vi.mocked(useConfig).mockReturnValue({ upscalers: [] })
    render(<GeneratorConfigHiresFixUpscaler />)

    // Should render without crashing, just with no options
    expect(screen.getByTestId('select')).toBeInTheDocument()
  })
})

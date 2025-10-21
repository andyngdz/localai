import { render, screen, waitFor } from '@testing-library/react'
import { UseFormReturn } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { useGeneratorForm, useGenerator } from '../../states'
import { Generator } from '../Generator'

// Mock all the feature components
vi.mock('@/features/generator-actions', () => ({
  GeneratorAction: () => (
    <div data-testid="generator-action">GeneratorAction</div>
  )
}))

vi.mock('@/features/generator-configs', () => ({
  GeneratorConfig: () => (
    <div data-testid="generator-config">GeneratorConfig</div>
  )
}))

vi.mock('@/features/generator-previewers', () => ({
  GeneratorPreviewer: () => (
    <div data-testid="generator-previewer">GeneratorPreviewer</div>
  )
}))

vi.mock('@/features/generator-prompts', () => ({
  GeneratorPrompt: () => (
    <div data-testid="generator-prompt">GeneratorPrompt</div>
  )
}))

vi.mock('@/features/histories', () => ({
  Histories: () => <div data-testid="histories">Histories</div>
}))

// Mock Allotment component
vi.mock('allotment', () => {
  const AllotmentPane = ({
    children,
    className,
    maxSize,
    minSize,
    preferredSize
  }: {
    children: React.ReactNode
    className?: string
    maxSize?: number
    minSize?: number
    preferredSize?: number
  }) => (
    <div
      data-testid="allotment-pane"
      className={className}
      data-max-size={maxSize}
      data-min-size={minSize}
      data-preferred-size={preferredSize}
    >
      {children}
    </div>
  )

  const AllotmentComponent = Object.assign(
    ({
      children,
      defaultSizes
    }: {
      children: React.ReactNode
      defaultSizes: number[]
    }) => (
      <div
        data-testid="allotment"
        data-default-sizes={JSON.stringify(defaultSizes)}
      >
        {children}
      </div>
    ),
    { Pane: AllotmentPane }
  )

  return {
    Allotment: AllotmentComponent,
    __esModule: true
  }
})

// Mock the state hooks
const mockOnGenerate = vi.fn()
const mockMethods: Partial<UseFormReturn<GeneratorConfigFormValues>> = {
  watch: vi.fn(),
  handleSubmit: vi.fn(),
  getValues: vi.fn(),
  getFieldState: vi.fn(),
  setError: vi.fn(),
  clearErrors: vi.fn(),
  setValue: vi.fn(),
  trigger: vi.fn(),
  formState: {} as UseFormReturn<GeneratorConfigFormValues>['formState'],
  resetField: vi.fn(),
  reset: vi.fn(),
  setFocus: vi.fn(),
  unregister: vi.fn(),
  control: {} as UseFormReturn<GeneratorConfigFormValues>['control'],
  register: vi.fn(),
  subscribe: vi.fn()
}

vi.mock('../../states', () => ({
  useGeneratorForm: vi.fn(),
  useGenerator: vi.fn()
}))

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-provider">{children}</div>
  )
}))

describe('Generator', () => {
  beforeEach(() => {
    // Setup default mocks
    ;(mockMethods.handleSubmit as ReturnType<typeof vi.fn>).mockReturnValue(
      vi.fn()
    )

    vi.mocked(useGeneratorForm).mockReturnValue({
      methods: mockMethods as UseFormReturn<GeneratorConfigFormValues>
    })

    vi.mocked(useGenerator).mockReturnValue({
      onGenerate: mockOnGenerate
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders all main components', () => {
    render(<Generator />)

    expect(screen.getByTestId('generator-config')).toBeInTheDocument()
    expect(screen.getByTestId('generator-prompt')).toBeInTheDocument()
    expect(screen.getByTestId('generator-action')).toBeInTheDocument()
    expect(screen.getByTestId('generator-previewer')).toBeInTheDocument()
    expect(screen.getByTestId('histories')).toBeInTheDocument()
  })

  it('uses useGeneratorForm hook', () => {
    render(<Generator />)

    expect(useGeneratorForm).toHaveBeenCalled()
  })

  it('uses useGenerator hook', () => {
    render(<Generator />)

    expect(useGenerator).toHaveBeenCalled()
  })

  it('renders form with correct attributes', () => {
    render(<Generator />)

    const form = screen.getByRole('form')
    expect(form).toHaveAttribute('name', 'generator')
  })

  it('configures form submit handler', () => {
    render(<Generator />)

    expect(mockMethods.handleSubmit).toHaveBeenCalledWith(mockOnGenerate)
  })

  it('renders Allotment with correct default sizes', () => {
    render(<Generator />)

    const allotment = screen.getByTestId('allotment')
    expect(allotment).toHaveAttribute(
      'data-default-sizes',
      JSON.stringify([300, 0, 300])
    )
  })

  it('renders three Allotment panes with correct configurations', () => {
    render(<Generator />)

    const panes = screen.getAllByTestId('allotment-pane')
    expect(panes).toHaveLength(3)

    // First pane (GeneratorConfig)
    expect(panes[0]).toHaveAttribute('data-max-size', '350')
    expect(panes[0]).toHaveAttribute('data-min-size', '300')
    expect(panes[0]).toHaveAttribute('data-preferred-size', '300')

    // Third pane (histories)
    expect(panes[2]).toHaveAttribute('data-max-size', '350')
    expect(panes[2]).toHaveAttribute('data-min-size', '300')
    expect(panes[2]).toHaveAttribute('data-preferred-size', '300')
  })

  it('starts with opacity-0 and transitions to opacity-100 when mounted', async () => {
    render(<Generator />)

    const form = screen.getByRole('form')
    expect(form).toHaveClass('opacity-0')

    await waitFor(() => {
      expect(form).toHaveClass('opacity-100')
    })
  })

  it('includes transition classes for opacity animation', () => {
    render(<Generator />)

    const form = screen.getByRole('form')
    expect(form).toHaveClass('w-full', 'h-full', 'transition-opacity')
  })
})

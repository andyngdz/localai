import { useSamplersQuery } from '@/cores/api-queries'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GeneratorConfigSamplerDropdown } from '../GeneratorConfigSamplerDropdown'

vi.mock('@/cores/api-queries', () => ({
  useSamplersQuery: vi.fn()
}))

vi.mock('../GeneratorConfigSamplerDropdownLoader', () => ({
  GeneratorConfigSamplerDropdownLoader: () => (
    <div data-testid="sampler-loader">Loading...</div>
  )
}))

describe('GeneratorConfigSamplerDropdown', () => {
  const mockSamplers = [
    {
      name: 'Euler A',
      value: 'EULER_A',
      description: 'Fast, exploratory, slightly non-deterministic.'
    },
    {
      name: 'DDIM',
      value: 'DDIM',
      description: 'Deterministic, stable, and widely used.'
    },
    {
      name: 'DPM++ 2M Karras',
      value: 'DPM_SOLVER_MULTISTEP_KARRAS',
      description:
        'Similar to DPM++ 2M, but with Karras noise schedule for potentially better quality.'
    }
  ]

  const Wrapper = ({ defaultValue = 'EULER_A' }: { defaultValue?: string }) => {
    const methods = useForm<GeneratorConfigFormValues>({
      defaultValues: {
        sampler: defaultValue
      } as GeneratorConfigFormValues
    })

    return (
      <FormProvider {...methods}>
        <GeneratorConfigSamplerDropdown />
      </FormProvider>
    )
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state when samplers are loading', () => {
    vi.mocked(useSamplersQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper />)

    expect(screen.getByTestId('sampler-loader')).toBeInTheDocument()
  })

  it('renders error alert when samplers fail to load', () => {
    vi.mocked(useSamplersQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper />)

    expect(screen.getByText('Failed to load samplers')).toBeInTheDocument()
  })

  it('renders warning alert when samplers array is empty', () => {
    vi.mocked(useSamplersQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper />)

    expect(screen.getByText('No samplers available')).toBeInTheDocument()
  })

  it('renders sampler options when data is loaded successfully', () => {
    vi.mocked(useSamplersQuery).mockReturnValue({
      data: mockSamplers,
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper />)

    const select = screen.getByRole('button', { name: /sampler/i })
    expect(select).not.toBeDisabled()
  })

  it('displays the default selected sampler', () => {
    vi.mocked(useSamplersQuery).mockReturnValue({
      data: mockSamplers,
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper defaultValue="EULER_A" />)

    const allEulerA = screen.getAllByText('Euler A')
    expect(allEulerA.length).toBeGreaterThan(0)
  })

  it('allows selecting a different sampler', async () => {
    const user = userEvent.setup()

    vi.mocked(useSamplersQuery).mockReturnValue({
      data: mockSamplers,
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper defaultValue="EULER_A" />)

    const select = screen.getByRole('button', { name: /sampler/i })
    await user.click(select)

    const ddimOptions = screen.getAllByText('DDIM')
    await user.click(ddimOptions[0])

    expect(screen.getAllByText('DDIM').length).toBeGreaterThan(0)
  })

  it('displays sampler descriptions', async () => {
    const user = userEvent.setup()

    vi.mocked(useSamplersQuery).mockReturnValue({
      data: mockSamplers,
      isLoading: false,
      isError: false
    } as unknown as ReturnType<typeof useSamplersQuery>)

    render(<Wrapper />)

    const select = screen.getByRole('button', { name: /sampler/i })
    await user.click(select)

    expect(
      screen.getByText('Fast, exploratory, slightly non-deterministic.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Deterministic, stable, and widely used.')
    ).toBeInTheDocument()
  })
})

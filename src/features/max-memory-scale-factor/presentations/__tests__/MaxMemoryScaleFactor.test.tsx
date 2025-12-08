import { api } from '@/services'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MaxMemoryScaleFactor } from '../MaxMemoryScaleFactor'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn()
  })
}))

vi.mock('@/services/api', () => ({
  api: {
    setMaxMemory: vi.fn()
  }
}))

vi.mock('@/features/setup-layout/presentations/SetupLayout', () => ({
  SetupLayout: ({
    children,
    onNext,
    title,
    description
  }: {
    children: React.ReactNode
    onNext?: VoidFunction
    title: string
    description: string
  }) => (
    <div data-testid="setup-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{children}</div>
      <button data-testid="next-button" onClick={onNext}>
        Next
      </button>
    </div>
  )
}))

const mockHandlers = vi.hoisted(() => ({
  onGpuChange: vi.fn(),
  onRamChange: vi.fn()
}))

vi.mock('@/cores/presentations/memory-scale-factor', () => ({
  MemoryScaleFactorItems: ({
    onGpuChange,
    onRamChange,
    gpuScaleFactor,
    ramScaleFactor
  }: {
    onGpuChange: (value: number) => void
    onRamChange: (value: number) => void
    gpuScaleFactor: number
    ramScaleFactor: number
  }) => (
    <div data-testid="memory-scale-factor-items">
      Memory Items
      <div data-testid="gpu-value">{gpuScaleFactor}</div>
      <div data-testid="ram-value">{ramScaleFactor}</div>
      <button
        data-testid="mock-gpu"
        onClick={() => {
          mockHandlers.onGpuChange(0.7)
          onGpuChange(0.7)
        }}
      >
        gpu
      </button>
      <button
        data-testid="mock-ram"
        onClick={() => {
          mockHandlers.onRamChange(0.4)
          onRamChange(0.4)
        }}
      >
        ram
      </button>
    </div>
  ),
  MemoryScaleFactorPreview: () => (
    <div data-testid="memory-scale-factor-preview">Memory Preview</div>
  )
}))

describe('MaxMemoryScaleFactor', () => {
  it('renders all components correctly', () => {
    render(<MaxMemoryScaleFactor />)

    // Check title and description
    expect(screen.getByText('Max Memory')).toBeInTheDocument()
    expect(
      screen.getByText('Configure the maximum memory allocation for AI models')
    ).toBeInTheDocument()

    // Check that child components are rendered
    expect(screen.getByTestId('memory-scale-factor-items')).toBeInTheDocument()
    expect(
      screen.getByTestId('memory-scale-factor-preview')
    ).toBeInTheDocument()
  })

  it('calls API and navigates on form submission', async () => {
    vi.mocked(api.setMaxMemory).mockResolvedValue({
      upscalers: [],
      safety_check_enabled: true,
      gpu_scale_factor: 0.5,
      ram_scale_factor: 0.5,
      total_gpu_memory: 12485197824,
      total_ram_memory: 32943878144,
      device_index: 0
    })
    const user = userEvent.setup()

    render(<MaxMemoryScaleFactor />)

    // Click the next button to submit the form
    await user.click(screen.getByTestId('next-button'))

    // Check that API was called with default scale factor
    await waitFor(() => {
      expect(api.setMaxMemory).toHaveBeenCalledWith({
        gpu_scale_factor: 0.5,
        ram_scale_factor: 0.5
      })
    })
  })

  it('updates watched values before submit when sliders change', async () => {
    const user = userEvent.setup()
    render(<MaxMemoryScaleFactor />)

    await user.click(screen.getByTestId('mock-gpu'))
    await user.click(screen.getByTestId('mock-ram'))
    await user.click(screen.getByTestId('next-button'))

    await waitFor(() => {
      expect(api.setMaxMemory).toHaveBeenCalledWith({
        gpu_scale_factor: 0.7,
        ram_scale_factor: 0.4
      })
    })

    expect(mockHandlers.onGpuChange).toHaveBeenCalledWith(0.7)
    expect(mockHandlers.onRamChange).toHaveBeenCalledWith(0.4)
  })
})

import { GenerationPhase } from '@/cores/sockets'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render, screen } from '@testing-library/react'
import type { MockInstance } from '@vitest/spy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as useGenerationPhaseModule from '../../states/useGenerationPhase'
import { GenerationPhaseStepper } from '../GenerationPhaseStepper'

expect.extend(matchers)

describe('GenerationPhaseStepper', () => {
  let useGenerationPhaseSpy: MockInstance

  beforeEach(() => {
    useGenerationPhaseSpy = vi.spyOn(
      useGenerationPhaseModule,
      'useGenerationPhase'
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('renders nothing when isVisible is false', () => {
    useGenerationPhaseSpy.mockReturnValue({
      phases: [],
      current: undefined,
      isVisible: false
    })

    const { container } = render(<GenerationPhaseStepper />)
    expect(container.firstChild).toBeNull()
  })

  it('renders stepper when isVisible is true', () => {
    useGenerationPhaseSpy.mockReturnValue({
      phases: [GenerationPhase.IMAGE_GENERATION],
      current: GenerationPhase.IMAGE_GENERATION,
      isVisible: true
    })

    render(<GenerationPhaseStepper />)

    expect(screen.getByText('Image Generation')).toBeTruthy()
  })

  it('renders multiple phases with separator', () => {
    useGenerationPhaseSpy.mockReturnValue({
      phases: [GenerationPhase.IMAGE_GENERATION, GenerationPhase.UPSCALING],
      current: GenerationPhase.IMAGE_GENERATION,
      isVisible: true
    })

    render(<GenerationPhaseStepper />)

    expect(screen.getByText('Image Generation')).toBeTruthy()
    expect(screen.getByText('Upscaling')).toBeTruthy()
    expect(screen.getByText('-')).toBeTruthy()
  })

  it('applies correct styling to container', () => {
    useGenerationPhaseSpy.mockReturnValue({
      phases: [GenerationPhase.IMAGE_GENERATION],
      current: GenerationPhase.IMAGE_GENERATION,
      isVisible: true
    })

    const { container } = render(<GenerationPhaseStepper />)

    const stepper = container.firstChild as HTMLElement
    expect(stepper.className).toContain('rounded-2xl')
    expect(stepper.className).toContain('backdrop-blur-md')
    expect(stepper.className).toContain('fixed')
    expect(stepper.className).toContain('bottom-6')
  })

  it('shows pulsing indicator on current phase', () => {
    useGenerationPhaseSpy.mockReturnValue({
      phases: [GenerationPhase.IMAGE_GENERATION, GenerationPhase.UPSCALING],
      current: GenerationPhase.UPSCALING,
      isVisible: true
    })

    const { container } = render(<GenerationPhaseStepper />)

    const indicators = container.querySelectorAll('.animate-pulse')
    expect(indicators.length).toBe(1)
  })
})

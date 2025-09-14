import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GeneratorConfig } from '../GeneratorConfig'

// Mock all sub-components
vi.mock('@/features/generator-config-extras/presentations/GeneratorConfigExtra', () => ({
  GeneratorConfigExtra: () => (
    <div data-testid="generator-config-extra">GeneratorConfigExtra Mock</div>
  )
}))

vi.mock('@/features/generator-config-formats/presentations/GeneratorConfigFormat', () => ({
  GeneratorConfigFormat: () => (
    <div data-testid="generator-config-format">GeneratorConfigFormat Mock</div>
  )
}))

vi.mock('@/features/generator-config-quantities/presentations/GeneratorConfigQuantity', () => ({
  GeneratorConfigQuantity: () => (
    <div data-testid="generator-config-quantity">GeneratorConfigQuantity Mock</div>
  )
}))

vi.mock('@/features/generator-config-sampling/presentations/GeneratorConfigSampling', () => ({
  GeneratorConfigSampling: () => (
    <div data-testid="generator-config-sampling">GeneratorConfigSampling Mock</div>
  )
}))

vi.mock('@/features/generator-config-seed/presentations/GeneratorConfigSeed', () => ({
  GeneratorConfigSeed: () => <div data-testid="generator-config-seed">GeneratorConfigSeed Mock</div>
}))

vi.mock('@/features/generator-config-styles/presentations/GeneratorConfigStyle', () => ({
  GeneratorConfigStyle: () => (
    <div data-testid="generator-config-style">GeneratorConfigStyle Mock</div>
  )
}))

vi.mock('@heroui/react', async () => {
  const actual = await vi.importActual<typeof import('@heroui/react')>('@heroui/react')
  return {
    ...actual,
    Divider: () => <hr data-testid="divider" />,
    ScrollShadow: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="scrollshadow" className={className}>
        {children}
      </div>
    )
  }
})

describe('GeneratorConfig', () => {
  it('should render all sub-components and dividers', () => {
    render(<GeneratorConfig />)

    // Verify all sub-components are rendered
    expect(screen.getByTestId('generator-config-format')).toBeInTheDocument()
    expect(screen.getByTestId('generator-config-extra')).toBeInTheDocument()
    expect(screen.getByTestId('generator-config-quantity')).toBeInTheDocument()
    expect(screen.getByTestId('generator-config-sampling')).toBeInTheDocument()
    expect(screen.getByTestId('generator-config-seed')).toBeInTheDocument()
    expect(screen.getByTestId('generator-config-style')).toBeInTheDocument()

    // Verify dividers are rendered (should be 5 dividers between 6 components)
    const dividers = screen.getAllByTestId('divider')
    expect(dividers.length).toBe(5)
  })
})

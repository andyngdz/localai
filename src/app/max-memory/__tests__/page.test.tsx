import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MaxMemoryScreen from '../page'

// Mock the MaxMemoryScaleFactor component
vi.mock(
  '@/features/max-memory-scale-factor/presentations/MaxMemoryScaleFactor',
  () => ({
    MaxMemoryScaleFactor: () => (
      <div data-testid="max-memory-scale-factor">
        Max Memory Scale Factor Component
      </div>
    )
  })
)

describe('MaxMemoryScreen', () => {
  it('renders MaxMemoryScaleFactor component', () => {
    render(<MaxMemoryScreen />)

    expect(screen.getByTestId('max-memory-scale-factor')).toBeInTheDocument()
    expect(
      screen.getByText('Max Memory Scale Factor Component')
    ).toBeInTheDocument()
  })

  it('returns MaxMemoryScaleFactor as default export', () => {
    const { container } = render(<MaxMemoryScreen />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByTestId('max-memory-scale-factor')).toBeInTheDocument()
  })

  it('has correct component structure', () => {
    const { container } = render(<MaxMemoryScreen />)

    // Should render only the MaxMemoryScaleFactor component
    expect(container.children).toHaveLength(1)
    expect(screen.getByTestId('max-memory-scale-factor')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const { container } = render(<MaxMemoryScreen />)

    expect(container.firstChild).toMatchSnapshot()
  })
})

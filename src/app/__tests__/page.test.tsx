import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomeScreen from '../page'

// Mock the HealthCheck component
vi.mock('@/features/health-check', () => ({
  HealthCheck: () => <div data-testid="health-check">Health Check Component</div>
}))

describe('HomeScreen', () => {
  it('renders HealthCheck component', () => {
    render(<HomeScreen />)

    expect(screen.getByTestId('health-check')).toBeInTheDocument()
    expect(screen.getByText('Health Check Component')).toBeInTheDocument()
  })

  it('returns HealthCheck as default export', () => {
    const { container } = render(<HomeScreen />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByTestId('health-check')).toBeInTheDocument()
  })

  it('has correct component structure', () => {
    const { container } = render(<HomeScreen />)

    // Should render only the HealthCheck component
    expect(container.children).toHaveLength(1)
    expect(screen.getByTestId('health-check')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const { container } = render(<HomeScreen />)

    expect(container.firstChild).toMatchSnapshot()
  })
})

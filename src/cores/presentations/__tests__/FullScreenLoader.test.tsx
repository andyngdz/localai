import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FullScreenLoader } from '../FullScreenLoader'

vi.mock('react-lottie', () => ({
  default: () => <div data-testid="lottie-animation">AI Animation</div>
}))

vi.mock('@/assets/ai.json', () => ({
  default: { mockAnimationData: true }
}))

describe('FullScreenLoader', () => {
  it('renders with message and animation', () => {
    render(<FullScreenLoader message="Loading..." />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument()
  })

  it('renders with different message', () => {
    render(<FullScreenLoader message="Initializing backend..." />)

    expect(screen.getByText('Initializing backend...')).toBeInTheDocument()
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument()
  })

  it('renders with custom message content', () => {
    const customMessage = 'Downloading model files'
    render(<FullScreenLoader message={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })
})

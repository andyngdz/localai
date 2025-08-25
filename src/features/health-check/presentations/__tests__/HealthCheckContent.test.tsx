import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HealthCheckContent } from '../HealthCheckContent'

describe('HealthCheckContent', () => {
  it('renders success message when isHealthy is true', () => {
    render(<HealthCheckContent isHealthy={true} />)

    expect(screen.getByText('LocalAI backend is running and ready to use')).toBeInTheDocument()

    const chip = screen.getByText('LocalAI backend is running and ready to use').closest('div')
    expect(chip).toHaveClass('bg-success')
  })

  it('renders error message when isHealthy is false', () => {
    render(<HealthCheckContent isHealthy={false} />)

    expect(screen.getByText('LocalAI backend is not running')).toBeInTheDocument()

    const chip = screen.getByText('LocalAI backend is not running').closest('div')
    expect(chip).toHaveClass('bg-danger')
  })

  it('has proper layout with flex justify-center', () => {
    const { container } = render(<HealthCheckContent isHealthy={true} />)

    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('flex')
    expect(mainDiv).toHaveClass('justify-center')
  })
})

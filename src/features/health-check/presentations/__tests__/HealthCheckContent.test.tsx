import { render, screen } from '@testing-library/react'
import { BackendStatusLevel } from '@types'
import { describe, expect, it } from 'vitest'
import { HealthCheckContent } from '../HealthCheckContent'

const makeStatus = (
  overrides: Partial<{
    level: BackendStatusLevel
    message: string
    timestamp: number
  }> = {}
) => ({
  level: BackendStatusLevel.Info,
  message: 'Default status message',
  timestamp: 1,
  ...overrides
})

describe('HealthCheckContent', () => {
  it('renders success message when isHealthy is true', () => {
    render(
      <HealthCheckContent
        isHealthy={true}
        statuses={[makeStatus({ message: 'Backend ready' })]}
      />
    )

    expect(
      screen.getByText('LocalAI backend is running and ready to use')
    ).toBeInTheDocument()

    const chip = screen
      .getByText('LocalAI backend is running and ready to use')
      .closest('div')
    expect(chip).toHaveClass('bg-success')
  })

  it('renders error message when isHealthy is false', () => {
    render(
      <HealthCheckContent
        isHealthy={false}
        statuses={[
          makeStatus({
            level: BackendStatusLevel.Error,
            message: 'uv installation failed',
            timestamp: 2
          })
        ]}
      />
    )

    const statusElements = screen.getAllByText('uv installation failed')
    expect(statusElements.length).toBeGreaterThan(0)

    const chip = statusElements[0].closest('div')
    expect(chip).toHaveClass('bg-danger')
  })

  it('has proper layout with flex justify-center', () => {
    const { container } = render(
      <HealthCheckContent isHealthy={true} statuses={[makeStatus()]} />
    )

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('flex')
    expect(mainDiv).toHaveClass('flex-col')
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SetupLayout } from '../SetupLayout'

// Mock the child components to simplify testing
vi.mock('../SetupLayoutBackground', () => ({
  SetupLayoutBackground: () => <div data-testid="mock-background" />
}))

vi.mock('../SetupLayoutContent', () => ({
  SetupLayoutContent: ({
    children,
    title,
    description
  }: {
    children: React.ReactNode
    title: string
    description: string
  }) => (
    <div data-testid="mock-content">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{children}</div>
    </div>
  )
}))

describe('SetupLayout', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    children: <div data-testid="test-children">Test Children</div>
  }

  it('renders background, content, and children correctly', () => {
    render(<SetupLayout {...defaultProps} />)

    // Check if background is rendered
    expect(screen.getByTestId('mock-background')).toBeInTheDocument()

    // Check if content is rendered with correct props
    expect(screen.getByTestId('mock-content')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()

    // Check if children are rendered
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
  })

  it('renders navigation buttons when handlers are provided', () => {
    const onNext = vi.fn()
    const onBack = vi.fn()

    render(<SetupLayout {...defaultProps} onNext={onNext} onBack={onBack} />)

    // Check if navigation buttons are rendered
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
  })

  it('does not render navigation buttons when handlers are not provided', () => {
    render(<SetupLayout {...defaultProps} />)

    // Check that no navigation buttons are rendered
    const buttons = screen.queryAllByRole('button')
    expect(buttons.length).toBe(0)
  })

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()

    render(<SetupLayout {...defaultProps} onNext={onNext} />)

    const nextButton = screen.getByRole('button')
    await user.click(nextButton)

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    render(<SetupLayout {...defaultProps} onBack={onBack} />)

    const backButton = screen.getByRole('button')
    await user.click(backButton)

    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isNextDisabled or isBackDisabled is true', () => {
    const onNext = vi.fn()
    const onBack = vi.fn()

    render(
      <SetupLayout
        {...defaultProps}
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={true}
        isBackDisabled={true}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})

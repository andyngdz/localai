import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ButtonProps } from '@heroui/react'
import { ModelSearchViewDownloadedButton } from '../ModelSearchViewDownloadedButton'

// Mock the Button from @heroui/react to a simple button for testing
vi.mock('@heroui/react', () => ({
  Button: ({ children, variant, className }: ButtonProps) => (
    <button data-testid="button" data-variant={variant} className={className}>
      {children}
    </button>
  )
}))

describe('ModelSearchViewDownloadedButton', () => {
  it('renders a bordered button with correct text', () => {
    // Arrange & Act
    render(<ModelSearchViewDownloadedButton />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-variant', 'bordered')
    expect(button).toHaveTextContent('Manage this model')
  })
})

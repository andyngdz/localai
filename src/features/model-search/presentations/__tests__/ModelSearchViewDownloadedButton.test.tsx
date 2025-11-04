import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

import { ButtonProps } from '@heroui/react'
import { ModelSearchViewDownloadedButton } from '../ModelSearchViewDownloadedButton'

// Mock openModal function
const mockOpenModal = vi.fn()

// Mock the settings store
vi.mock('@/features/settings/states/useSettingsStore', () => ({
  useSettingsStore: () => ({
    openModal: mockOpenModal
  })
}))

// Mock the Button from @heroui/react to a simple button for testing
vi.mock('@heroui/react', () => ({
  Button: ({ children, variant, className, onPress }: ButtonProps) => (
    <button
      data-testid="button"
      data-variant={variant}
      className={className}
      onClick={() => onPress?.({} as never)}
    >
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

  it('opens settings modal with models tab when clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<ModelSearchViewDownloadedButton />)

    // Act
    const button = screen.getByTestId('button')
    await user.click(button)

    // Assert
    expect(mockOpenModal).toHaveBeenCalledWith('models')
  })
})

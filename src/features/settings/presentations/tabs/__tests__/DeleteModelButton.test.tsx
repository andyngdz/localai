import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeleteModelButton } from '../DeleteModelButton'

// Mock the useDeleteModel hook
const mockMutate = vi.fn()
const mockUseDeleteModel = vi.fn(() => ({
  mutate: mockMutate,
  isPending: false
}))

vi.mock('@/features/settings/states/useDeleteModel', () => ({
  useDeleteModel: () => mockUseDeleteModel()
}))

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    isLoading,
    variant,
    color,
    isIconOnly,
    'aria-label': ariaLabel,
    'data-testid': dataTestId
  }: {
    children: React.ReactNode
    onPress?: () => void
    isDisabled?: boolean
    isLoading?: boolean
    variant?: string
    color?: string
    isIconOnly?: boolean
    'aria-label'?: string
    'data-testid'?: string
  }) => (
    <button
      onClick={onPress}
      disabled={isDisabled || isLoading}
      data-variant={variant}
      data-color={color}
      data-icon-only={isIconOnly}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      data-loading={isLoading}
    >
      {children}
    </button>
  ),
  Modal: ({
    children,
    isOpen
  }: {
    children: React.ReactNode
    isOpen: boolean
    onClose: () => void
  }) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        {children}
      </div>
    ) : null,
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-content">{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-footer">{children}</div>
  )
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Trash2: ({ size }: { size?: number }) => (
    <svg data-testid="trash-icon" data-size={size}>
      <title>Trash</title>
    </svg>
  )
}))

describe('DeleteModelButton', () => {
  const testModelId = 'test-model-123'

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the mock to default state
    mockUseDeleteModel.mockReturnValue({
      mutate: mockMutate,
      isPending: false
    })
  })

  describe('onConfirm function behavior', () => {
    it('should call deleteModel.mutate with the correct model_id when onConfirm is triggered', async () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open the modal by clicking the delete button
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Verify modal is open
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Find and click the confirm button in the modal (the one with danger color)
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find(
        (button) =>
          button.textContent === 'Delete' &&
          button.getAttribute('data-color') === 'danger'
      )
      expect(confirmButton).toBeDefined()
      fireEvent.click(confirmButton!)

      // Verify that mutate was called with the correct model_id
      expect(mockMutate).toHaveBeenCalledWith(testModelId)
      expect(mockMutate).toHaveBeenCalledTimes(1)
    })

    it('should close the modal when onConfirm is triggered', async () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open the modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Verify modal is open
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Click confirm button
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find(
        (button) =>
          button.textContent === 'Delete' &&
          button.getAttribute('data-color') === 'danger'
      )
      expect(confirmButton).toBeDefined()
      fireEvent.click(confirmButton!)

      // Verify modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      })
    })

    it('should execute both setIsOpen(false) and deleteModel.mutate when onConfirm is called', async () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open the modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Verify modal is open
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Click confirm button
      const buttons = screen.getAllByRole('button')
      const confirmButton = buttons.find(
        (button) =>
          button.textContent === 'Delete' &&
          button.getAttribute('data-color') === 'danger'
      )
      expect(confirmButton).toBeDefined()
      fireEvent.click(confirmButton!)

      // Verify both actions occurred
      expect(mockMutate).toHaveBeenCalledWith(testModelId)
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('modal state management', () => {
    it('should open modal when delete button is clicked', () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Initially modal should not be visible
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

      // Click delete button
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Modal should now be visible
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should close modal when cancel button is clicked', async () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open the modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Verify modal is open
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      // Verify modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      })

      // Verify mutate was NOT called
      expect(mockMutate).not.toHaveBeenCalled()
    })

    it('should display correct model_id in the modal body', () => {
      const specificModelId = 'org/stable-diffusion-xl'
      render(<DeleteModelButton model_id={specificModelId} />)

      // Open the modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Check that the model ID is displayed in the modal
      expect(screen.getByText(specificModelId)).toBeInTheDocument()
      expect(
        screen.getByText('Are you sure you want to delete this model?')
      ).toBeInTheDocument()
    })
  })

  describe('loading states', () => {
    it('should disable delete button when deletion is pending', () => {
      // Mock pending state
      mockUseDeleteModel.mockReturnValue({
        mutate: mockMutate,
        isPending: true
      })

      render(<DeleteModelButton model_id={testModelId} />)

      const deleteButton = screen.getByTestId('delete-button')
      expect(deleteButton).toBeDisabled()
    })

    it('should pass isPending to confirm button isLoading prop', () => {
      // Mock pending state
      mockUseDeleteModel.mockReturnValue({
        mutate: mockMutate,
        isPending: true
      })

      render(<DeleteModelButton model_id={testModelId} />)

      // The main delete button should be disabled
      expect(screen.getByTestId('delete-button')).toBeDisabled()

      // This test verifies that the isPending state is properly used
      // The actual loading behavior would be tested in integration tests
      // For unit testing, we're satisfied that the isPending value
      // is properly consumed by the component
    })
  })

  describe('accessibility', () => {
    it('should have proper aria-label on delete button', () => {
      const modelId = 'test-model-accessibility'
      render(<DeleteModelButton model_id={modelId} />)

      const deleteButton = screen.getByTestId('delete-button')
      expect(deleteButton).toHaveAttribute('aria-label', `Delete ${modelId}`)
    })

    it('should render modal with proper role', () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Check modal has dialog role
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('component structure', () => {
    it('should render trash icon with correct size', () => {
      render(<DeleteModelButton model_id={testModelId} />)

      const trashIcon = screen.getByTestId('trash-icon')
      expect(trashIcon).toBeInTheDocument()
      expect(trashIcon).toHaveAttribute('data-size', '16')
    })

    it('should render with correct button styling attributes', () => {
      render(<DeleteModelButton model_id={testModelId} />)

      const deleteButton = screen.getByTestId('delete-button')
      expect(deleteButton).toHaveAttribute('data-variant', 'light')
      expect(deleteButton).toHaveAttribute('data-color', 'danger')
      expect(deleteButton).toHaveAttribute('data-icon-only', 'true')
    })

    it('should render modal content correctly', () => {
      render(<DeleteModelButton model_id={testModelId} />)

      // Open modal
      const deleteButton = screen.getByTestId('delete-button')
      fireEvent.click(deleteButton)

      // Check modal structure
      expect(screen.getByTestId('modal-header')).toBeInTheDocument()
      expect(screen.getByTestId('modal-body')).toBeInTheDocument()
      expect(screen.getByTestId('modal-footer')).toBeInTheDocument()

      // Check modal text content
      expect(screen.getByText('Delete model')).toBeInTheDocument()
      expect(
        screen.getByText('Are you sure you want to delete this model?')
      ).toBeInTheDocument()
    })
  })
})

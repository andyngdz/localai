import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateSettings } from '../UpdateSettings'

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    isLoading,
    color
  }: {
    children: React.ReactNode
    onPress?: () => void
    isLoading?: boolean
    color?: string
  }) => (
    <button
      onClick={onPress}
      disabled={isLoading}
      data-loading={isLoading}
      data-color={color}
    >
      {children}
    </button>
  ),
  addToast: vi.fn()
}))

describe('UpdateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(window.electronAPI.updater.checkForUpdates).mockResolvedValue({
      updateAvailable: false
    })
  })

  it('renders the component with title and description', () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    expect(screen.getByText('Application updates')).toBeInTheDocument()
    expect(screen.getByText(/Current version:/)).toBeInTheDocument()
  })

  it('renders the current version once resolved', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    expect(
      await screen.findByText(/Current version: 1.2.3/i)
    ).toBeInTheDocument()
  })

  it('shows "Development Build" as default version before API resolves', () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    expect(
      screen.getByText(/Current version: Development Build/i)
    ).toBeInTheDocument()
  })

  it('renders check for updates button with correct text', () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    const button = screen.getByRole('button', {
      name: /Check for updates/i
    })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('data-color', 'primary')
  })

  it('requests an update check when the button is pressed', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    const button = screen.getByRole('button', {
      name: /Check for updates/i
    })

    fireEvent.click(button)

    await waitFor(() =>
      expect(window.electronAPI.updater.checkForUpdates).toHaveBeenCalled()
    )
  })

  it('shows loading state while checking for updates', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')
    vi.mocked(window.electronAPI.updater.checkForUpdates).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<UpdateSettings />)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    // Button should show loading state
    await waitFor(() => {
      expect(button).toHaveAttribute('data-loading', 'true')
      expect(button).toHaveTextContent('Checking…')
      expect(button).toBeDisabled()
    })
  })

  it('returns to normal state after check completes', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')
    vi.mocked(window.electronAPI.updater.checkForUpdates).mockResolvedValue({
      updateAvailable: false
    })

    render(<UpdateSettings />)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    // Wait for loading state
    await waitFor(() => expect(button).toHaveAttribute('data-loading', 'true'))

    // Wait for loading to finish
    await waitFor(() => {
      expect(button).toHaveAttribute('data-loading', 'false')
      expect(button).toHaveTextContent('Check for updates')
      expect(button).not.toBeDisabled()
    })
  })

  it('handles update check errors gracefully', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')
    vi.mocked(window.electronAPI.updater.checkForUpdates).mockRejectedValue(
      new Error('Network error')
    )

    render(<UpdateSettings />)

    const button = screen.getByRole('button')

    fireEvent.click(button)

    // Button should return to normal state after error
    await waitFor(() => {
      expect(button).toHaveAttribute('data-loading', 'false')
      expect(button).toHaveTextContent('Check for updates')
    })
  })

  it('can be clicked multiple times', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')
    vi.mocked(window.electronAPI.updater.checkForUpdates).mockResolvedValue({
      updateAvailable: false
    })

    render(<UpdateSettings />)

    const button = screen.getByRole('button')

    // First click
    fireEvent.click(button)
    await waitFor(() =>
      expect(window.electronAPI.updater.checkForUpdates).toHaveBeenCalledTimes(
        1
      )
    )

    // Wait for loading to finish
    await waitFor(() => expect(button).not.toBeDisabled())

    // Second click
    fireEvent.click(button)
    await waitFor(() =>
      expect(window.electronAPI.updater.checkForUpdates).toHaveBeenCalledTimes(
        2
      )
    )
  })
})

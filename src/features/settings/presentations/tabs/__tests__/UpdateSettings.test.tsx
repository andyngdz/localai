import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateSettings } from '../UpdateSettings'

vi.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    isDisabled
  }: {
    children: React.ReactNode
    onPress?: () => void
    isDisabled?: boolean
  }) => (
    <button onClick={onPress} disabled={isDisabled}>
      {children}
    </button>
  ),
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-body">{children}</div>
  )
}))

describe('UpdateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requests an update check when the button is pressed', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    const button = await screen.findByRole('button', {
      name: /Check for updates/i
    })

    fireEvent.click(button)

    await waitFor(() =>
      expect(window.electronAPI.updater.checkForUpdates).toHaveBeenCalled()
    )

    expect(button).toHaveTextContent('Check for updates')
  })

  it('renders the current version once resolved', async () => {
    vi.mocked(window.electronAPI.app.getVersion).mockResolvedValue('1.2.3')

    render(<UpdateSettings />)

    expect(
      await screen.findByText(/Current version: v1.2.3/i)
    ).toBeInTheDocument()
  })
})

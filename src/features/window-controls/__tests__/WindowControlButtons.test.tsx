import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowState } from '../states/useWindowState'
import { WindowControlButtons } from '../presentations/WindowControlButtons'

describe('WindowControlButtons', () => {
  const mockWindowAPI = {
    minimize: vi.fn().mockResolvedValue(undefined),
    maximize: vi.fn().mockResolvedValue(undefined),
    unmaximize: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    isMaximized: vi.fn().mockResolvedValue(false),
    onMaximizedChange: vi.fn(() => vi.fn())
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useWindowState.setState({ isMaximized: false })

    global.window.electronAPI = {
      window: mockWindowAPI
    } as unknown as typeof global.window.electronAPI
  })

  it('renders all three control buttons', () => {
    render(<WindowControlButtons />)

    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument()
    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument()
    expect(screen.getByLabelText('Close window')).toBeInTheDocument()
  })

  it('calls minimize when minimize button is clicked', async () => {
    const user = userEvent.setup()
    render(<WindowControlButtons />)

    await user.click(screen.getByLabelText('Minimize window'))

    expect(mockWindowAPI.minimize).toHaveBeenCalledOnce()
  })

  it('calls maximize when maximize button is clicked and window is not maximized', async () => {
    const user = userEvent.setup()
    useWindowState.setState({ isMaximized: false })
    render(<WindowControlButtons />)

    await user.click(screen.getByLabelText('Maximize window'))

    expect(mockWindowAPI.maximize).toHaveBeenCalledOnce()
    expect(mockWindowAPI.unmaximize).not.toHaveBeenCalled()
  })

  it('calls unmaximize when maximize button is clicked and window is maximized', async () => {
    const user = userEvent.setup()
    useWindowState.setState({ isMaximized: true })
    render(<WindowControlButtons />)

    await user.click(screen.getByLabelText('Restore window'))

    expect(mockWindowAPI.unmaximize).toHaveBeenCalledOnce()
    expect(mockWindowAPI.maximize).not.toHaveBeenCalled()
  })

  it('calls close when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<WindowControlButtons />)

    await user.click(screen.getByLabelText('Close window'))

    expect(mockWindowAPI.close).toHaveBeenCalledOnce()
  })

  it('shows correct aria-label for maximize button based on window state', () => {
    const { rerender } = render(<WindowControlButtons />)

    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument()

    useWindowState.setState({ isMaximized: true })
    rerender(<WindowControlButtons />)

    expect(screen.getByLabelText('Restore window')).toBeInTheDocument()
  })
})

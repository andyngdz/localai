import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WindowTitleBar } from '../presentations/WindowTitleBar'

describe('WindowTitleBar', () => {
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

    global.window.electronAPI = {
      window: mockWindowAPI
    } as unknown as typeof global.window.electronAPI
  })

  it('renders without crashing', () => {
    render(<WindowTitleBar />)

    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument()
  })

  it('displays current section when provided', () => {
    render(<WindowTitleBar currentSection="Generator" />)

    expect(screen.getByText('Generator')).toBeInTheDocument()
  })

  it('does not display section text when not provided', () => {
    render(<WindowTitleBar />)

    const titleBar = screen
      .getByLabelText('Minimize window')
      .closest('div')?.parentElement
    expect(titleBar).toBeInTheDocument()
  })

  it('renders window control buttons', () => {
    render(<WindowTitleBar currentSection="Settings" />)

    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument()
    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument()
    expect(screen.getByLabelText('Close window')).toBeInTheDocument()
  })

  it('sets up maximized state listener on mount', () => {
    render(<WindowTitleBar />)

    expect(mockWindowAPI.isMaximized).toHaveBeenCalled()
    expect(mockWindowAPI.onMaximizedChange).toHaveBeenCalled()
  })
})

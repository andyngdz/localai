import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { BackendLogList } from '../BackendLogList'
import type { LogEntry } from '@types'

// Mock dependencies
vi.mock('../../states', () => ({
  useBackendLog: vi.fn()
}))

vi.mock('@/services', () => ({
  dateFormatter: {
    timeFromTimestamp: vi.fn((timestamp) => `${timestamp}`)
  }
}))

vi.mock('@heroui/react', () => ({
  ScrollShadow: ({
    children,
    className
  }: {
    children: React.ReactNode
    className: string
  }) => (
    <div data-testid="scroll-shadow" className={className}>
      {children}
    </div>
  )
}))

import { useBackendLog } from '../../states'

const mockUseBackendLog = vi.mocked(useBackendLog)

describe('BackendLogList', () => {
  const mockScrollRef = { current: null }
  const mockVirtualizer = {
    getVirtualItems: vi.fn<() => unknown[]>(() => []),
    getTotalSize: vi.fn(() => 1000),
    measureElement: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBackendLog.mockReturnValue({
      logs: [],
      onGetLogColor: vi.fn(() => 'text-default-700' as const),
      scrollRef: mockScrollRef,
      rowVirtualizer: mockVirtualizer as never,
      isStreaming: false,
      clearLogs: vi.fn()
    })
  })

  it('renders ScrollShadow container', () => {
    render(<BackendLogList />)

    const scrollShadow = screen.getByTestId('scroll-shadow')
    expect(scrollShadow).toBeInTheDocument()
    expect(scrollShadow).toHaveClass('scrollbar-thin', 'h-96')
  })

  it('renders empty list when no logs', () => {
    const { container } = render(<BackendLogList />)

    const relativeDiv = container.querySelector('.relative')
    expect(relativeDiv).toBeInTheDocument()
    expect(relativeDiv).toHaveStyle({ height: '1000px' })
  })

  it('renders log entries', () => {
    const mockLogs: LogEntry[] = [
      { timestamp: 1234567890, level: 'info', message: 'Test log' }
    ]

    mockVirtualizer.getVirtualItems.mockReturnValue([
      { index: 0, key: 'log-0', start: 0, size: 50, measureElement: vi.fn() }
    ])

    mockUseBackendLog.mockReturnValue({
      logs: mockLogs,
      onGetLogColor: vi.fn(() => 'text-secondary' as const),
      scrollRef: mockScrollRef,
      rowVirtualizer: mockVirtualizer as never,
      isStreaming: false,
      clearLogs: vi.fn()
    })

    render(<BackendLogList />)

    expect(screen.getByText('Test log')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })

  it('applies correct color classes', () => {
    const mockLogs: LogEntry[] = [
      { timestamp: 1234567890, level: 'error', message: 'Error log' }
    ]

    mockVirtualizer.getVirtualItems.mockReturnValue([
      { index: 0, key: 'log-0', start: 0, size: 50, measureElement: vi.fn() }
    ])

    mockUseBackendLog.mockReturnValue({
      logs: mockLogs,
      onGetLogColor: (level) =>
        level === 'error'
          ? ('text-danger' as const)
          : ('text-default-700' as const),
      scrollRef: mockScrollRef,
      rowVirtualizer: mockVirtualizer as never,
      isStreaming: false,
      clearLogs: vi.fn()
    })

    render(<BackendLogList />)

    const message = screen.getByText('Error log')
    expect(message).toHaveClass('text-danger')
  })
})

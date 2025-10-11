import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ModelDownloadStatusLine } from '../ModelDownloadStatusLine'

// Mock the useDownloadWatcher hook
const mockUseDownloadWatcher = vi.fn()
vi.mock('@/features/download-watcher', () => ({
  useDownloadWatcher: (id: string) => mockUseDownloadWatcher(id)
}))

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
  Divider: ({ className }: { className?: string }) => (
    <div data-testid="divider" className={className} />
  ),
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  )
}))

describe('ModelDownloadStatusLine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders divider always', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0 })

    render(<ModelDownloadStatusLine id="test-model" />)

    expect(screen.getByTestId('divider')).toBeInTheDocument()
  })

  it('calls useDownloadWatcher with correct id', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0 })

    render(<ModelDownloadStatusLine id="test-model-123" />)

    expect(mockUseDownloadWatcher).toHaveBeenCalledWith('test-model-123')
  })

  it('does not show indicator when percent is 0', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0 })

    render(<ModelDownloadStatusLine id="test-model" />)

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })

  it('does not show indicator when percent is negative', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: -0.1 })

    render(<ModelDownloadStatusLine id="test-model" />)

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })

  it('shows indicator when percent is greater than 0', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0.5 })

    render(<ModelDownloadStatusLine id="test-model" />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('shows correct progress bar width for 50% completion', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0.5 })

    const { container } = render(<ModelDownloadStatusLine id="test-model" />)

    const progressBar = container.querySelector('.bg-primary') as HTMLElement
    expect(progressBar).toBeInTheDocument()
    expect(progressBar.style.width).toBe('50%')
  })

  it('shows correct progress bar width for 75% completion', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0.75 })

    const { container } = render(<ModelDownloadStatusLine id="test-model" />)

    const progressBar = container.querySelector('.bg-primary') as HTMLElement
    expect(progressBar).toBeInTheDocument()
    expect(progressBar.style.width).toBe('75%')
  })

  it('shows correct progress bar width for 100% completion', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 1 })

    const { container } = render(<ModelDownloadStatusLine id="test-model" />)

    const progressBar = container.querySelector('.bg-primary') as HTMLElement
    expect(progressBar).toBeInTheDocument()
    expect(progressBar.style.width).toBe('100%')
  })

  it('applies correct styling to indicator container', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0.5 })

    const { container } = render(<ModelDownloadStatusLine id="test-model" />)

    const indicatorContainer = container.querySelector(
      '.ml-0\\.5.mr-0\\.5.absolute.flex.flex-col.h-1.inset-0'
    )
    expect(indicatorContainer).toBeInTheDocument()
  })

  it('applies transition classes to progress bar', () => {
    mockUseDownloadWatcher.mockReturnValue({ percent: 0.5 })

    const { container } = render(<ModelDownloadStatusLine id="test-model" />)

    const progressBar = container.querySelector('.bg-primary') as HTMLElement
    expect(progressBar).toHaveClass('transition-all')
    expect(progressBar).toHaveClass('duration-500')
    expect(progressBar).toHaveClass('ease-in-out')
  })
})

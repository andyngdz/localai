import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ModelRecommendationsDownloadButton } from '../ModelRecommendationsDownloadButton'

// Mock the download watcher store
const mockUseDownloadWatcherStore = vi.fn()
vi.mock('@/features/download-watcher', () => ({
  useDownloadWatcherStore: (selector: (state: unknown) => unknown) =>
    mockUseDownloadWatcherStore(selector)
}))

// Mock the API
vi.mock('@/services', () => ({
  api: {
    downloadModel: vi.fn()
  }
}))

// Import the mocked api to access the mock function
import { api } from '@/services'
const mockDownloadModel = vi.mocked(api.downloadModel)

// Mock HeroUI Button
vi.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    color,
    variant,
    size,
    className,
    startContent
  }: {
    children: React.ReactNode
    onPress: () => void
    isDisabled?: boolean
    color?: string
    variant?: string
    size?: string
    className?: string
    startContent?: React.ReactNode
  }) => (
    <button
      onClick={onPress}
      disabled={isDisabled}
      data-testid="download-button"
      data-color={color}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {startContent}
      {children}
    </button>
  )
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Download: ({ size }: { size: number }) => (
    <div data-testid="download-icon" data-size={size}>
      Download Icon
    </div>
  )
}))

describe('ModelRecommendationsDownloadButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementation
    mockUseDownloadWatcherStore.mockImplementation((selector) => {
      const state = {
        id: null,
        percent: 0
      }
      return selector(state)
    })
  })

  describe('Idle State (Not Downloading)', () => {
    it('renders download button with correct text', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Download')).toBeInTheDocument()
    })

    it('shows download icon when not downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByTestId('download-icon')).toBeInTheDocument()
    })

    it('applies default color and solid variant when not downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).toHaveAttribute('data-color', 'default')
      expect(button).toHaveAttribute('data-variant', 'solid')
    })

    it('is not disabled when no model is downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).not.toBeDisabled()
    })

    it('calls api.downloadModel when button is clicked', async () => {
      const user = userEvent.setup()
      mockDownloadModel.mockResolvedValue(undefined)

      render(<ModelRecommendationsDownloadButton modelId="test-model-123" />)

      const button = screen.getByTestId('download-button')
      await user.click(button)

      await waitFor(() => {
        expect(mockDownloadModel).toHaveBeenCalledWith('test-model-123')
      })
    })

    it('does not show progress bar when not downloading', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector('.bg-primary\\/30')
      expect(progressBar).not.toBeInTheDocument()
    })
  })

  describe('This Model Downloading', () => {
    beforeEach(() => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = {
          id: 'test-model',
          percent: 0.45
        }
        return selector(state)
      })
    })

    it('shows downloading text with percentage', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Downloading... 45%')).toBeInTheDocument()
    })

    it('does not show download icon when downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.queryByTestId('download-icon')).not.toBeInTheDocument()
    })

    it('applies primary color and bordered variant when downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).toHaveAttribute('data-color', 'primary')
      expect(button).toHaveAttribute('data-variant', 'bordered')
    })

    it('is not disabled when this model is downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).not.toBeDisabled()
    })

    it('shows progress bar with correct width', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector(
        '.bg-primary\\/30'
      ) as HTMLElement
      expect(progressBar).toBeInTheDocument()
      expect(progressBar.style.width).toBe('45%')
    })

    it('applies animate-pulse class to text when downloading', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const span = container.querySelector('.animate-pulse')
      expect(span).toBeInTheDocument()
    })

    it('applies text-foreground class when downloading', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const span = container.querySelector('.text-foreground')
      expect(span).toBeInTheDocument()
    })
  })

  describe('Another Model Downloading', () => {
    beforeEach(() => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = {
          id: 'other-model',
          percent: 0.6
        }
        return selector(state)
      })
    })

    it('shows Download text (not downloading)', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Download')).toBeInTheDocument()
    })

    it('is disabled when another model is downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).toBeDisabled()
    })

    it('does not show progress bar when another model is downloading', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector('.bg-primary\\/30')
      expect(progressBar).not.toBeInTheDocument()
    })

    it('shows download icon when another model is downloading', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByTestId('download-icon')).toBeInTheDocument()
    })
  })

  describe('Progress Bar Widths', () => {
    it('shows 0% width at start', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 0.01 }
        return selector(state)
      })

      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector(
        '.bg-primary\\/30'
      ) as HTMLElement
      expect(progressBar.style.width).toBe('1%')
    })

    it('shows 50% width at halfway', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 0.5 }
        return selector(state)
      })

      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector(
        '.bg-primary\\/30'
      ) as HTMLElement
      expect(progressBar.style.width).toBe('50%')
    })

    it('shows 100% width when complete', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 1 }
        return selector(state)
      })

      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector(
        '.bg-primary\\/30'
      ) as HTMLElement
      expect(progressBar.style.width).toBe('100%')
    })
  })

  describe('Percentage Display', () => {
    it('rounds percentage to nearest integer', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 0.456 }
        return selector(state)
      })

      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Downloading... 46%')).toBeInTheDocument()
    })

    it('shows 0% at start', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 0.001 }
        return selector(state)
      })

      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Downloading... 0%')).toBeInTheDocument()
    })

    it('shows 100% when complete', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 1 }
        return selector(state)
      })

      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      expect(screen.getByText('Downloading... 100%')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies correct size', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).toHaveAttribute('data-size', 'sm')
    })

    it('applies w-full and z-10 classes to button', () => {
      render(<ModelRecommendationsDownloadButton modelId="test-model" />)

      const button = screen.getByTestId('download-button')
      expect(button).toHaveClass('w-full', 'relative', 'z-10')
    })

    it('applies font-semibold class to text', () => {
      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const span = container.querySelector('.font-semibold')
      expect(span).toBeInTheDocument()
    })

    it('applies transition classes to progress bar', () => {
      mockUseDownloadWatcherStore.mockImplementation((selector) => {
        const state = { id: 'test-model', percent: 0.5 }
        return selector(state)
      })

      const { container } = render(
        <ModelRecommendationsDownloadButton modelId="test-model" />
      )

      const progressBar = container.querySelector('.bg-primary\\/30')
      expect(progressBar).toHaveClass('transition-all', 'duration-300')
    })
  })
})

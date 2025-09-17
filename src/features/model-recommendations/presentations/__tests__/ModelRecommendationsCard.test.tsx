import { useDownloadWatcherStore } from '@/features/download-watcher'
import { UseDownloadWatcherStore } from '@/features/download-watcher'
import { ModelRecommendationItem } from '@/types/api'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ModelRecommendationsCard } from '../ModelRecommendationsCard'

// Mock the Card component from @heroui/react with simplified props
vi.mock('@heroui/react', () => ({
  Card: ({
    children,
    className,
    onPress,
    isPressable,
    isDisabled
  }: {
    children: React.ReactNode
    className?: string
    onPress?: () => void
    isPressable?: boolean
    isDisabled?: boolean
  }) => (
    <div
      data-testid="card"
      className={className}
      onClick={() => {
        if (!isDisabled && isPressable) {
          onPress?.()
        }
      }}
      data-is-pressable={isPressable ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
  Button: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>
}))

// Create mock functions outside of the vi.mock call
// These need to be accessed by our tests and vi.mock is hoisted
const mockWatch = vi.fn()
const mockSetValue = vi.fn()

// Mock react-hook-form with a simplified approach
vi.mock('react-hook-form', () => {
  return {
    // Simple mock that just returns our predefined object
    useFormContext: () => ({
      // Important properties for our tests
      watch: mockWatch,
      setValue: mockSetValue,
      // Add common methods that might be used
      getValues: vi.fn(),
      formState: {
        errors: {},
        isValid: true,
        isDirty: false
      },
      control: {},
      register: vi.fn(),
      handleSubmit: vi.fn(),
      reset: vi.fn()
    })
  }
})

// Mock the child components
vi.mock('../ModelRecommendationMemoryBox', () => ({
  ModelRecommendationMemoryBox: ({ icon, content }: { icon: React.ReactNode; content: string }) => (
    <div data-testid="memory-box" data-content={content}>
      {icon}
    </div>
  )
}))

vi.mock('../ModelRecommendationsBadge', () => ({
  ModelRecommendationsBadge: () => <div data-testid="recommendations-badge">Star</div>
}))

vi.mock('../ModelRecommendationsTags', () => ({
  ModelRecommendationsTags: ({ tags }: { tags: string[] }) => (
    <div data-testid="tags">{tags.join(', ')}</div>
  )
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Gpu: ({ size }: { size: number }) => (
    <div data-testid="gpu-icon" data-size={size}>
      GPU
    </div>
  ),
  HardDrive: ({ size }: { size: number }) => (
    <div data-testid="harddrive-icon" data-size={size}>
      HardDrive
    </div>
  )
}))

// Mock the download watcher store
vi.mock('@/features/download-watcher', () => ({
  useDownloadWatcherStore: vi.fn()
}))

describe('ModelRecommendationsCard', () => {
  const mockModel: ModelRecommendationItem = {
    id: 'model1',
    name: 'Test Model',
    description: 'A test model description',
    memory_requirement_gb: 8,
    model_size: '7B',
    tags: ['tag1', 'tag2'],
    is_recommended: true
  }

  let downloadWatcherState: UseDownloadWatcherStore

  const setDownloadWatcherState = (downloadingId: string | null) => {
    downloadWatcherState = {
      id: downloadingId ?? '',
      percent: 0,
      onUpdatePercent: vi.fn(),
      onSetId: vi.fn()
    }
  }

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    // Set default return values
    mockWatch.mockReturnValue(undefined)
    setDownloadWatcherState(null)

    vi.mocked(useDownloadWatcherStore).mockImplementation(((
      selector?: (state: UseDownloadWatcherStore) => unknown
    ) => {
      return selector ? selector(downloadWatcherState) : downloadWatcherState
    }) as typeof useDownloadWatcherStore)
  })

  // Helper to setup the component with different watch values
  const setup = (
    selectedId: string | undefined = undefined,
    downloadingModelId: string | null = null
  ) => {
    // Set the return values for our hooks
    mockWatch.mockReturnValue(selectedId)

    setDownloadWatcherState(downloadingModelId)

    return {
      setValue: mockSetValue,
      ...render(<ModelRecommendationsCard model={mockModel} />)
    }
  }

  it('renders the model name and description', () => {
    setup(undefined, null)

    expect(screen.getByText('Test Model')).toBeInTheDocument()
    expect(screen.getByText('A test model description')).toBeInTheDocument()
  })

  it('displays recommendation badge when model is recommended', () => {
    setup(undefined, null)

    expect(screen.getByTestId('recommendations-badge')).toBeInTheDocument()
  })

  it("doesn't display recommendation badge when model is not recommended", () => {
    const nonRecommendedModel = {
      ...mockModel,
      is_recommended: false
    }

    // Reset and setup the mock values
    mockWatch.mockReset()
    mockSetValue.mockReset()
    mockWatch.mockReturnValue(undefined)
    setDownloadWatcherState(null)

    render(<ModelRecommendationsCard model={nonRecommendedModel} />)

    expect(screen.queryByTestId('recommendations-badge')).not.toBeInTheDocument()
  })

  it('displays memory boxes with correct content', () => {
    setup(undefined, null)

    const memoryBoxes = screen.getAllByTestId('memory-box')
    expect(memoryBoxes).toHaveLength(2)

    expect(memoryBoxes[0]).toHaveAttribute('data-content', '7B')
    expect(memoryBoxes[1]).toHaveAttribute('data-content', '8 GB')

    expect(screen.getByTestId('harddrive-icon')).toBeInTheDocument()
    expect(screen.getByTestId('gpu-icon')).toBeInTheDocument()
  })

  it('displays tags component with correct tags', () => {
    setup(undefined, null)

    const tagsElement = screen.getByTestId('tags')
    expect(tagsElement).toBeInTheDocument()
    expect(tagsElement).toHaveTextContent('tag1, tag2')
  })

  it('applies selected styling when model id matches selected id', () => {
    setup('model1', null)

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-primary/10')
    expect(card).toHaveClass('border-primary')
    expect(card).not.toHaveClass('hover:border-primary/50')

    const title = screen.getByText('Test Model')
    expect(title).toHaveClass('text-primary')
    expect(title).not.toHaveClass('text-base-content')
  })

  it("applies non-selected styling when model id doesn't match selected id", () => {
    setup('different-id', null)

    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('bg-primary/10')
    expect(card).not.toHaveClass('border-primary')
    expect(card).toHaveClass('hover:border-primary/50')

    const title = screen.getByText('Test Model')
    expect(title).not.toHaveClass('text-primary')
    expect(title).toHaveClass('text-base-content')
  })

  it('calls setValue with model id when card is clicked', () => {
    const { setValue } = setup(undefined, null)

    const card = screen.getByTestId('card')
    fireEvent.click(card)

    expect(setValue).toHaveBeenCalledWith('id', 'model1')
  })

  it('renders with pressable card', () => {
    setup(undefined, null)

    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-is-pressable', 'true')
  })

  it('disables card when a different model is downloading', () => {
    setup(undefined, 'different-model-id')

    const card = screen.getByTestId('card')
    expect(card).toHaveClass('opacity-50')
    expect(card).toHaveClass('cursor-not-allowed')
    expect(card).toHaveAttribute('data-is-pressable', 'false')
  })

  it('does not disable card when no model is downloading', () => {
    setup(undefined, null)

    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('opacity-50')
    expect(card).not.toHaveClass('cursor-not-allowed')
    expect(card).toHaveAttribute('data-is-pressable', 'true')
  })

  it('does not disable card when the same model is downloading', () => {
    setup(undefined, 'model1')

    const card = screen.getByTestId('card')
    expect(card).not.toHaveClass('opacity-50')
    expect(card).not.toHaveClass('cursor-not-allowed')
    expect(card).toHaveAttribute('data-is-pressable', 'true')
  })

  it('does not call setValue when card is disabled and clicked', () => {
    const { setValue } = setup(undefined, 'different-model-id')

    const card = screen.getByTestId('card')
    fireEvent.click(card)

    expect(setValue).not.toHaveBeenCalled()
  })
})

import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ModelSearchViewFooter } from '../ModelSearchViewFooter'
import { useDownloadedModels } from '@/cores/hooks'

// Mock the dependencies
vi.mock('@/cores/hooks', () => ({
  useDownloadedModels: vi.fn()
}))

vi.mock('../ModelSearchViewDownloadButton', () => ({
  ModelSearchViewDownloadButton: ({ id }: { id: string }) => (
    <div data-testid="download-button" data-id={id}>
      Download Button
    </div>
  )
}))

vi.mock('../ModelSearchViewDownloadedButton', () => ({
  ModelSearchViewDownloadedButton: () => (
    <div data-testid="downloaded-button">Downloaded Button</div>
  )
}))

vi.mock('lucide-react', () => ({
  Info: () => <div data-testid="info-icon">Info Icon</div>
}))

describe('ModelSearchViewFooter', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with info text and icon', () => {
    // Arrange
    vi.mocked(useDownloadedModels).mockReturnValue({
      onCheckDownloaded: () => false,
      downloadedModels: []
    })

    // Act
    render(<ModelSearchViewFooter id="test-model-id" />)

    // Assert
    expect(screen.getByTestId('info-icon')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Optimized download: Only essential files are downloaded, saving space'
      )
    ).toBeInTheDocument()
  })

  it('renders download button when model is not downloaded', () => {
    // Arrange
    const mockCheckDownloaded = vi.fn().mockReturnValue(false)
    vi.mocked(useDownloadedModels).mockReturnValue({
      onCheckDownloaded: mockCheckDownloaded,
      downloadedModels: []
    })

    // Act
    render(<ModelSearchViewFooter id="test-model-id" />)

    // Assert
    const downloadButton = screen.getByTestId('download-button')
    expect(downloadButton).toBeInTheDocument()
    expect(downloadButton).toHaveAttribute('data-id', 'test-model-id')
    expect(mockCheckDownloaded).toHaveBeenCalledWith('test-model-id')
    expect(screen.queryByTestId('downloaded-button')).not.toBeInTheDocument()
  })

  it('renders downloaded button when model is already downloaded', () => {
    // Arrange
    const mockCheckDownloaded = vi.fn().mockReturnValue(true)
    vi.mocked(useDownloadedModels).mockReturnValue({
      onCheckDownloaded: mockCheckDownloaded,
      downloadedModels: [
        {
          model_id: 'test-model-id',
          id: 1,
          created_at: '2025-08-25T14:30:00Z',
          updated_at: '2025-08-25T14:30:00Z',
          model_dir: '/path/to/model'
        }
      ]
    })

    // Act
    render(<ModelSearchViewFooter id="test-model-id" />)

    // Assert
    expect(screen.getByTestId('downloaded-button')).toBeInTheDocument()
    expect(mockCheckDownloaded).toHaveBeenCalledWith('test-model-id')
    expect(screen.queryByTestId('download-button')).not.toBeInTheDocument()
  })

  it('re-renders correctly when id prop changes', () => {
    // Arrange
    const mockCheckDownloaded = vi
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)

    vi.mocked(useDownloadedModels).mockReturnValue({
      onCheckDownloaded: mockCheckDownloaded,
      downloadedModels: []
    })

    // Act
    const { rerender } = render(<ModelSearchViewFooter id="model-1" />)

    // Assert - first render
    expect(screen.getByTestId('download-button')).toBeInTheDocument()
    expect(mockCheckDownloaded).toHaveBeenCalledWith('model-1')

    // Act - rerender with different id and downloaded state
    rerender(<ModelSearchViewFooter id="model-2" />)

    // Assert - after rerender
    expect(screen.getByTestId('downloaded-button')).toBeInTheDocument()
    expect(mockCheckDownloaded).toHaveBeenCalledWith('model-2')
  })
})

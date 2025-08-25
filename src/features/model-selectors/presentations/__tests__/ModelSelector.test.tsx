import { ModelDownloaded } from '@/types/api'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useModelSelectors } from '../../states/useModelSelectors'
import { useModelSelectorStore } from '../../states/useModelSelectorStores'
import { ModelSelector } from '../ModelSelector'

// Mock dependencies
vi.mock('../../states/useModelSelectors', () => ({
  useModelSelectors: vi.fn()
}))

vi.mock('../../states/useModelSelectorStores', () => ({
  useModelSelectorStore: vi.fn()
}))

describe('ModelSelector', () => {
  const mockSetId = vi.fn()
  const mockModels: ModelDownloaded[] = [
    {
      model_id: 'model-1',
      id: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      model_dir: '/path/to/model-1'
    },
    {
      model_id: 'model-2',
      id: 2,
      created_at: '2023-01-02',
      updated_at: '2023-01-02',
      model_dir: '/path/to/model-2'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(useModelSelectors).mockReturnValue({
      data: mockModels
    })

    vi.mocked(useModelSelectorStore).mockReturnValue({
      id: 'model-1',
      setId: mockSetId
    })
  })

  it('should render the dropdown with current model id', () => {
    render(<ModelSelector />)

    // Check that the button with the current model ID is rendered
    expect(screen.getByRole('button', { name: /model-1/i })).toBeInTheDocument()
  })

  it('should render nothing when no data is available', () => {
    // Set data to null to match the component's check condition
    vi.mocked(useModelSelectors).mockReturnValue({
      data: null as unknown as ModelDownloaded[]
    })

    const { container } = render(<ModelSelector />)

    // Should be empty when no data
    expect(container.firstChild).toBeNull()
  })

  it('should display all model options in the dropdown', async () => {
    const user = userEvent.setup()
    render(<ModelSelector />)

    // Open the dropdown
    await user.click(screen.getByRole('button'))

    // Check that all model options are displayed
    // Use getAllByText and check count since there are multiple elements with these texts
    expect(screen.getAllByText('model-1').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('model-2').length).toBeGreaterThanOrEqual(1)
  })

  it('should call setId when a different model is selected', async () => {
    const user = userEvent.setup()
    render(<ModelSelector />)

    // Open the dropdown
    await user.click(screen.getByRole('button'))

    // Select a different model
    await user.click(screen.getByText('model-2'))

    // Check that setId was called with the correct model ID
    expect(mockSetId).toHaveBeenCalledWith('model-2')
  })
})

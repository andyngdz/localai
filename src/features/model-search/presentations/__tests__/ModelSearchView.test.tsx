import { createQueryClientWrapper } from '@/cores/test-utils';
import { ModelDetailsResponse } from '@/types';
import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define the mock model ID
const mockModelId = 'test-model-123';

// Mock data that will be used in the tests
const mockModelDetailsData: ModelDetailsResponse = {
  id: 'test-model-123',
  author: 'test-author',
  downloads: 5000,
  likes: 1000,
  tags: ['tag1', 'tag2'],
  created_at: '2023-01-01T00:00:00.000Z',
  disabled: false,
  gated: 'false',
  last_modified: '2023-01-02T00:00:00.000Z',
  library_name: 'test-library',
  pipeline_tag: ['test'],
  private: false,
  sha: 'abc123',
  spaces: ['space-1', 'space-2'],
  siblings: [
    { blob_id: 'blob-1', rfilename: 'file1.bin', size: 1000 },
    { blob_id: 'blob-2', rfilename: 'file2.bin', size: 2000 },
  ],
};

// Create spy functions to track hook calls and control returned values
const useModelSearchViewMock = vi.fn();
const useModelSelectorStoreMock = vi.fn().mockReturnValue({ model_id: mockModelId });

// Create mocks with vi.mock
vi.mock('../../states', () => ({
  useModelSelectorStore: () => useModelSelectorStoreMock(),
}));

// Mock useModelSearchView to track calls and return controlled data
vi.mock('../../states/useModelSearchView', () => ({
  useModelSearchView: (id: string) => useModelSearchViewMock(id),
}));

// Mock ScrollShadow to a simple wrapper to make DOM assertions stable
vi.mock('@heroui/react', () => ({
  ScrollShadow: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div data-testid="scrollshadow" className={className}>
      {children}
    </div>
  ),
}));

// Mock child components
vi.mock('../ModelSearchViewCard', () => ({
  ModelSearchViewCard: ({
    author,
    downloads,
    id,
    likes,
    tags,
  }: {
    author: string;
    downloads: number;
    id: string;
    likes: number;
    tags: string[];
  }) => (
    <div data-testid="mock-view-card">
      <div>ID: {id}</div>
      <div>Author: {author}</div>
      <div>Downloads: {downloads}</div>
      <div>Likes: {likes}</div>
      <div>Tags: {tags.join(', ')}</div>
    </div>
  ),
}));

vi.mock('../ModelSearchViewSpaces', () => ({
  ModelSearchViewSpaces: ({ spaces }: { spaces: string[] }) => (
    <div data-testid="mock-view-spaces">
      <div>Spaces: {spaces.length}</div>
    </div>
  ),
}));

vi.mock('../ModelSearchViewFiles', () => ({
  ModelSearchViewFiles: ({
    id,
    siblings,
  }: {
    id: string;
    siblings: { blob_id: string; rfilename: string; size: number }[];
  }) => (
    <div data-testid="mock-view-files">
      <div>ID: {id}</div>
      <div>Siblings: {siblings.length}</div>
    </div>
  ),
}));

// Import the component under test AFTER mocks so they take effect
import { ModelSearchView } from '../ModelSearchView';

describe('ModelSearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation for each test
    useModelSearchViewMock.mockClear();
  });

  it('renders nothing when no model details are available', () => {
    // Mock the hook to return undefined model details
    useModelSearchViewMock.mockReturnValue({
      modelDetails: undefined,
      isLoading: false,
      isError: false,
    });

    const { container } = render(<ModelSearchView />, {
      wrapper: createQueryClientWrapper(),
    });

    // The component should render nothing when no model details are available
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('mock-view-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-view-spaces')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-view-files')).not.toBeInTheDocument();
  });

  it('renders all sections when model details are available', () => {
    // Set up mock to return model details
    useModelSearchViewMock.mockReturnValue({
      modelDetails: mockModelDetailsData,
      isLoading: false,
      isError: false,
    });

    render(<ModelSearchView />, {
      wrapper: createQueryClientWrapper(),
    });

    // Should render all three sections
    expect(screen.getByTestId('mock-view-card')).toBeInTheDocument();
    expect(screen.getByTestId('mock-view-spaces')).toBeInTheDocument();
    expect(screen.getByTestId('mock-view-files')).toBeInTheDocument();

    // Check the content of the card section
    expect(
      within(screen.getByTestId('mock-view-card')).getByText('ID: test-model-123'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('mock-view-card')).getByText('Author: test-author'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('mock-view-card')).getByText('Downloads: 5000'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('mock-view-card')).getByText('Likes: 1000'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('mock-view-card')).getByText('Tags: tag1, tag2'),
    ).toBeInTheDocument();

    // Check the content of the spaces section
    expect(screen.getByText('Spaces: 2')).toBeInTheDocument();

    // Check the content of the files section
    expect(screen.getByText('Siblings: 2')).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    // Set up mock to return model details
    useModelSearchViewMock.mockReturnValue({
      modelDetails: mockModelDetailsData,
      isLoading: false,
      isError: false,
    });

    render(<ModelSearchView />, {
      wrapper: createQueryClientWrapper(),
    });

    // Verify that the model ID from the store is passed to useModelSearchView
    expect(useModelSearchViewMock).toHaveBeenCalledWith('test-model-123');

    // The ScrollShadow component should wrap all child components
    const childComponents = screen.getAllByTestId(/mock-view-/);
    expect(childComponents).toHaveLength(3);

    // The wrapper should have the scrollbar-thin class
    const scrollShadow = screen.getByTestId('scrollshadow');
    expect(scrollShadow).toHaveClass('scrollbar-thin');
  });
});

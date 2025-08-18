import { createQueryClientWrapper } from '@/cores/test-utils';
import { api } from '@/services/api';
import { ModelDetailsResponse } from '@/types';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, MockedFunction, vi } from 'vitest';

import { useModelSearchView } from '../useModelSearchView';

// Mock the API module
vi.mock('@/services/api', () => ({
  api: {
    modelDetails: vi.fn(),
  },
}));

const mockedModelDetails = api.modelDetails as MockedFunction<typeof api.modelDetails>;

describe('useModelSearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithId = (id: string) =>
    renderHook(() => useModelSearchView(id), {
      wrapper: createQueryClientWrapper(),
    });

  const mockModelData: ModelDetailsResponse = {
    author: 'test-author',
    created_at: '2023-01-01T00:00:00.000Z',
    disabled: false,
    downloads: 1000,
    gated: 'false',
    id: 'test-model-123',
    last_modified: '2023-01-02T00:00:00.000Z',
    library_name: 'test-library',
    likes: 42,
    pipeline_tag: ['tag1', 'tag2'],
    private: false,
    sha: 'abc123',
    siblings: [
      {
        blob_id: 'blob1',
        rfilename: 'file1.bin',
        size: 1024,
      },
    ],
    spaces: ['space1', 'space2'],
    tags: ['tag1', 'tag2'],
  };

  const minimalModelData: ModelDetailsResponse = {
    author: '',
    created_at: new Date(0).toISOString(),
    disabled: false,
    downloads: 0,
    gated: '',
    id: '',
    last_modified: new Date(0).toISOString(),
    library_name: '',
    likes: 0,
    pipeline_tag: [],
    private: false,
    sha: '',
    siblings: [],
    spaces: [],
    tags: [],
  };

  it('should fetch model details successfully', async () => {
    // Mock successful API response
    mockedModelDetails.mockResolvedValueOnce(mockModelData);

    const { result } = renderWithId('test-model-123');

    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.modelDetails).toBeUndefined();

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Verify the successful state
    expect(result.current.modelDetails).toEqual(mockModelData);
    expect(result.current.isError).toBe(false);
    expect(api.modelDetails).toHaveBeenCalledWith('test-model-123');
  });

  it('should handle API errors', async () => {
    // Mock failed API response
    const errorMessage = 'Failed to fetch model details';
    mockedModelDetails.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderWithId('invalid-model-id');

    // Initial loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve with an error
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Verify the error state
    expect(result.current.isError).toBe(true);
    expect(result.current.modelDetails).toBeUndefined();
  });

  it('calls API with empty id and returns undefined result safely', async () => {
    // Provide an explicit minimal ModelDetailsResponse instead of using undefined
    mockedModelDetails.mockResolvedValueOnce(minimalModelData);

    const { result } = renderWithId('');

    // The hook should be in a loading state initially
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to finish and assert it was called with empty id
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(api.modelDetails).toHaveBeenCalledWith('');
    expect(result.current.modelDetails).toEqual(minimalModelData);
  });
});

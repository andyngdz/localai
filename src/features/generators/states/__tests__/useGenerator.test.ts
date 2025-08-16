import { createQueryClientWrapper } from '@/cores/test-utils';
import { api } from '@/services/api';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGenerator } from '../useGenerator';

// Mock the API module with a factory so addHistory is a mock function
vi.mock('@/services/api', () => ({
  api: {
    addHistory: vi.fn(),
  },
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('useGenerator', () => {
  const mockConfig = {
    model: 'test-model',
    prompt: 'test-prompt',
    negative_prompt: '',
    width: 512,
    height: 512,
    cfg_scale: 7,
    steps: 20,
    seed: -1,
    sampler_name: 'Euler a',
    hires_fix: false,
    number_of_images: 1,
    styles: [],
  };

  it('should call mutate with the config', async () => {
    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });
    result.current.onGenerate(mockConfig);

    await waitFor(() => {
      expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    });
  });

  it('should handle success case', async () => {
    vi.mocked(api.addHistory).mockResolvedValue(1); // API returns a number ID
    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });
    result.current.onGenerate(mockConfig);

    await waitFor(() => {
      expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    });
  });

  it('should handle error case', async () => {
    const error = new Error('Test error');
    vi.mocked(api.addHistory).mockRejectedValue(error);
    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });
    result.current.onGenerate(mockConfig);

    await waitFor(() => {
      expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    });
  });
});

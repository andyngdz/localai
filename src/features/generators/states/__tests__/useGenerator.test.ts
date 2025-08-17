import { createQueryClientWrapper } from '@/cores/test-utils';
import { api } from '@/services/api';
import { addToast } from '@heroui/react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGenerator } from '../useGenerator';

// Mock the API module with a factory so addHistory is a mock function
vi.mock('@/services/api', () => ({
  api: {
    addHistory: vi.fn(),
    generator: vi.fn().mockResolvedValue({
      items: [],
      nsfw_content_detected: [],
    }),
  },
}));

// Mock HeroUI addToast function
vi.mock('@heroui/react', () => ({
  addToast: vi.fn(),
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

    await act(async () => {
      await result.current.onGenerate(mockConfig);
    });

    expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
  });

  it('should handle success case', async () => {
    vi.mocked(api.addHistory).mockResolvedValue(1); // API returns a number ID

    // Mock the generator API with a proper response
    const mockGeneratorResponse = {
      items: [{ path: 'test/path.jpg', file_name: 'test.jpg' }],
      nsfw_content_detected: [false],
    };
    vi.mocked(api.generator).mockResolvedValue(mockGeneratorResponse);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });

    await act(async () => {
      await result.current.onGenerate(mockConfig);
    });

    expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    expect(api.generator).toHaveBeenCalledWith({
      history_id: 1,
      config: mockConfig,
    });
  });

  it('should handle error case', async () => {
    const mockError = new Error('Test error');
    vi.mocked(api.addHistory).mockRejectedValue(mockError);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });

    // Explicitly checking for the error
    let errorWasCaught = false;

    await act(async () => {
      try {
        await result.current.onGenerate(mockConfig);
        // If we get here, the test should fail because we expect an error
        expect('This code should not be reached').toBe('Promise should reject');
      } catch (err) {
        errorWasCaught = true;
        expect(err).toEqual(mockError);
      }
    });

    expect(errorWasCaught).toBe(true);
    expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    // Generator function should not be called since addHistory fails
    expect(api.generator).not.toHaveBeenCalled();
  });

  it('should handle error case for generator', async () => {
    const error = new Error('Generator error');
    vi.mocked(api.addHistory).mockResolvedValue(1);
    vi.mocked(api.generator).mockRejectedValue(error);

    const wrapper = createQueryClientWrapper();
    const { result } = renderHook(() => useGenerator(), { wrapper });

    await act(async () => {
      // We expect the promise to reject, but we don't need to do anything with the error
      // since we're just testing that onError callback was triggered
      try {
        await result.current.onGenerate(mockConfig);
        // If we get here, the test should fail because we expect an error
        expect('This code should not be reached').toBe('Promise should reject');
      } catch {
        // Error is expected - test will continue
      }
    });

    expect(api.addHistory).toHaveBeenCalledWith(mockConfig);
    expect(api.generator).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Something went wrong',
        color: 'danger',
      }),
    );
  });
});

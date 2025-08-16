import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createQueryClientWrapper } from '../../cores/test-utils';
import { api } from '../api';
import {
  useHardwareQuery,
  useHealthQuery,
  useMemoryQuery,
  useModelRecommendationsQuery,
} from '../queries';

// Mock the API service
vi.mock('../api', () => ({
  api: {
    health: vi.fn(),
    getHardwareStatus: vi.fn(),
    getMemory: vi.fn(),
    getModelRecommendations: vi.fn(),
  },
}));

describe('Query Hooks', () => {
  const wrapper = createQueryClientWrapper();

  describe('useHealthQuery', () => {
    it('calls api.health and returns the data', async () => {
      const mockResponse = { status: 'ok', message: 'Server is healthy' };
      vi.mocked(api.health).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useHealthQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.health).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockResponse);
    });

    it('handles error', async () => {
      const mockError = new Error('Network error');
      vi.mocked(api.health).mockRejectedValue(mockError);

      const { result } = renderHook(() => useHealthQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(api.health).toHaveBeenCalled();
    });
  });

  describe('useHardwareQuery', () => {
    it('calls api.getHardwareStatus and returns the data', async () => {
      const mockResponse = {
        is_cuda: true,
        cuda_runtime_version: '11.8',
        nvidia_driver_version: '520.61.05',
        gpus: [
          {
            name: 'NVIDIA GeForce RTX 3090',
            memory: 24576,
            cuda_compute_capability: '8.6',
            is_primary: true,
          },
        ],
        message: 'CUDA is available',
      };
      vi.mocked(api.getHardwareStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useHardwareQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.getHardwareStatus).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useMemoryQuery', () => {
    it('calls api.getMemory and returns the data', async () => {
      const mockResponse = { gpu: 24576000000, ram: 32000000000 };
      vi.mocked(api.getMemory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMemoryQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.getMemory).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useModelRecommendationsQuery', () => {
    it('calls api.getModelRecommendations and returns the data', async () => {
      const mockResponse = {
        sections: [
          {
            id: 'section1',
            name: 'Section 1',
            description: 'Test section',
            models: [
              {
                id: 'model1',
                name: 'Model 1',
                description: 'Test model',
                memory_requirement_gb: 4,
                model_size: 'Medium',
                tags: ['tag1', 'tag2'],
                is_recommended: true,
              },
            ],
            is_recommended: true,
          },
        ],
        default_section: 'section1',
        default_selected_id: 'model1',
      };
      vi.mocked(api.getModelRecommendations).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useModelRecommendationsQuery(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(api.getModelRecommendations).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});

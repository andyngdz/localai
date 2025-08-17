import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGeneratorConfigStyle } from '../useGeneratorConfigStyleItem';

// Mock react-hook-form
const mockWatch = vi.fn();
const mockSetValue = vi.fn();

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    watch: (field: string, defaultValue: unknown) => {
      mockWatch(field, defaultValue);
      return mockWatch.mock.results[mockWatch.mock.results.length - 1]?.value || defaultValue || [];
    },
    setValue: mockSetValue,
    getValues: vi.fn(),
    formState: {
      errors: {},
      isValid: true,
      isDirty: false,
    },
    control: {},
    register: vi.fn(),
    handleSubmit: vi.fn(),
    reset: vi.fn(),
  }),
}));

describe('useGeneratorConfigStyle', () => {
  const styleId = 'test-style-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when style is not selected', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue([]);
    });

    it('should return isSelected as false', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current.isSelected).toBe(false);
    });

    it("should call watch with 'styles'", () => {
      renderHook(() => useGeneratorConfigStyle(styleId));

      expect(mockWatch).toHaveBeenCalledWith('styles', []);
    });

    it('should add style to selection when onClick is called', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      act(() => {
        result.current.onClick();
      });

      expect(mockSetValue).toHaveBeenCalledWith('styles', [styleId]);
    });
  });

  describe('when style is already selected', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue([styleId, 'other-style-id']);
    });

    it('should return isSelected as true', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current.isSelected).toBe(true);
    });

    it('should remove style from selection when onClick is called', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      act(() => {
        result.current.onClick();
      });

      expect(mockSetValue).toHaveBeenCalledWith('styles', ['other-style-id']);
    });
  });

  describe('when multiple styles are selected', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue(['style1', styleId, 'style2']);
    });

    it('should return isSelected as true', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current.isSelected).toBe(true);
    });

    it('should remove only the specific style when onClick is called', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      act(() => {
        result.current.onClick();
      });

      expect(mockSetValue).toHaveBeenCalledWith('styles', ['style1', 'style2']);
    });
  });

  describe('when styles array is undefined', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue(undefined);
    });

    it('should return isSelected as false', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current.isSelected).toBe(false);
    });

    it('should add style to empty array when onClick is called', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      act(() => {
        result.current.onClick();
      });

      expect(mockSetValue).toHaveBeenCalledWith('styles', [styleId]);
    });
  });

  describe('when styles array is null', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue(null);
    });

    it('should return isSelected as false', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current.isSelected).toBe(false);
    });

    it('should add style to empty array when onClick is called', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      act(() => {
        result.current.onClick();
      });

      expect(mockSetValue).toHaveBeenCalledWith('styles', [styleId]);
    });
  });

  describe('return value structure', () => {
    beforeEach(() => {
      mockWatch.mockReturnValue([]);
    });

    it('should return an object with isSelected and onClick properties', () => {
      const { result } = renderHook(() => useGeneratorConfigStyle(styleId));

      expect(result.current).toHaveProperty('isSelected');
      expect(result.current).toHaveProperty('onClick');
      expect(typeof result.current.isSelected).toBe('boolean');
      expect(typeof result.current.onClick).toBe('function');
    });
  });
});

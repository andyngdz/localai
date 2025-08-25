import { ApiError } from '@/types/api'
import { UseQueryResult } from '@tanstack/react-query'
import { vi } from 'vitest'

export const createMockQueryResult = <T>(
  data?: T,
  overrides: Partial<UseQueryResult<T, ApiError>> = {}
): UseQueryResult<T, ApiError> =>
  ({
    data,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: !!data,
    refetch: vi.fn(),
    fetchStatus: 'idle',
    status: 'success',
    isFetching: false,
    isPending: false,
    isStale: false,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isPlaceholderData: false,
    isRefetchError: false,
    isLoadingError: false,
    remove: vi.fn(),
    ...overrides
  }) as unknown as UseQueryResult<T, ApiError>

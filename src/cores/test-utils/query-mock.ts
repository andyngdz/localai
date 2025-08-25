import { UseQueryResult } from '@tanstack/react-query'
import { ApiError } from '@/types/api'

/**
 * Creates a mock query result with the provided data.
 *
 * @template T The type of data returned by the query
 * @param {T | null} data The data to be returned by the mock query
 * @param {Partial<UseQueryResult<T, ApiError>>} overrides Optional overrides for the query result
 * @returns {UseQueryResult<T, ApiError>} A mock query result
 */
export const createMockQuery = <T>(
  data: T | null,
  overrides?: Partial<UseQueryResult<T, ApiError>>
): UseQueryResult<T, ApiError> => {
  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: !!data,
    ...overrides
  } as UseQueryResult<T, ApiError>
}

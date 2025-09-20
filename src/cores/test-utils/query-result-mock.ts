import { UseQueryResult } from '@tanstack/react-query'

export const createMockQueryResult = <T>(
  data?: T,
  overrides = {}
): UseQueryResult<T> =>
  ({
    data,
    ...overrides
  }) as unknown as UseQueryResult<T>

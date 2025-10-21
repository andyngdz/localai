import { createQueryClientWrapper } from '@/cores/test-utils/query-client'
import { createMockQueryResult } from '@/cores/test-utils/query-result-mock'
import { useStyleSectionsQuery } from '@/cores/api-queries'
import { ApiError, StyleItem, StyleSection } from '@/types'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStyleSections } from '../useStyleSections'

vi.mock('@/cores/api-queries', () => ({
  useStyleSectionsQuery: vi.fn()
}))

describe('useStyleSections', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return empty arrays as default data when query returns undefined', () => {
    // Arrange
    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult<StyleSection[]>(undefined, {
        isLoading: false,
        error: null
      })
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.styleSections).toEqual([])
    expect(result.current.styleItems).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should return data from the query', () => {
    // Arrange
    const mockStyleItem: StyleItem = {
      id: 'style1',
      name: 'Test Style',
      origin: 'test',
      license: 'MIT',
      positive: 'beautiful',
      negative: 'ugly',
      image: '/images/style1.png'
    }

    const mockData: StyleSection[] = [
      {
        id: 'section1',
        styles: [mockStyleItem]
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.styleSections).toEqual(mockData)
    expect(result.current.styleItems).toEqual([mockStyleItem])
  })

  it('should flatten styles from multiple sections into styleItems', () => {
    // Arrange
    const mockStyleItem1: StyleItem = {
      id: 'style1',
      name: 'Style 1',
      origin: 'test',
      license: 'MIT',
      positive: 'beautiful',
      image: '/images/style1.png'
    }

    const mockStyleItem2: StyleItem = {
      id: 'style2',
      name: 'Style 2',
      origin: 'test',
      license: 'Apache',
      positive: 'elegant',
      negative: 'messy',
      image: '/images/style2.png'
    }

    const mockStyleItem3: StyleItem = {
      id: 'style3',
      name: 'Style 3',
      origin: 'community',
      license: 'Creative Commons',
      positive: 'vibrant',
      image: '/images/style3.png'
    }

    const mockData: StyleSection[] = [
      {
        id: 'section1',
        styles: [mockStyleItem1, mockStyleItem2]
      },
      {
        id: 'section2',
        styles: [mockStyleItem3]
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.styleItems).toEqual([
      mockStyleItem1,
      mockStyleItem2,
      mockStyleItem3
    ])
    expect(result.current.styleItems).toHaveLength(3)
  })

  it('should handle empty sections correctly', () => {
    // Arrange
    const mockData: StyleSection[] = [
      {
        id: 'section1',
        styles: []
      },
      {
        id: 'section2',
        styles: []
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.styleSections).toEqual(mockData)
    expect(result.current.styleItems).toEqual([])
  })

  it('should handle mixed sections with some empty and some with styles', () => {
    // Arrange
    const mockStyleItem: StyleItem = {
      id: 'style1',
      name: 'Test Style',
      origin: 'test',
      license: 'MIT',
      positive: 'beautiful',
      image: '/images/style1.png'
    }

    const mockData: StyleSection[] = [
      {
        id: 'section1',
        styles: []
      },
      {
        id: 'section2',
        styles: [mockStyleItem]
      },
      {
        id: 'section3',
        styles: []
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.styleSections).toEqual(mockData)
    expect(result.current.styleItems).toEqual([mockStyleItem])
  })

  it('should pass through loading state from query', () => {
    // Arrange
    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult<StyleSection[]>(undefined, { isLoading: true })
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.isLoading).toBe(true)
  })

  it('should pass through error state from query', () => {
    // Arrange
    const mockError: ApiError = {
      message: 'Failed to fetch styles',
      status: 500
    }

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult<StyleSection[]>(undefined, { error: mockError })
    )

    // Act
    const { result } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    // Assert
    expect(result.current.error).toEqual(mockError)
  })

  it('should memoize styleItems and only recalculate when styleSections change', () => {
    // Arrange
    const mockStyleItem: StyleItem = {
      id: 'style1',
      name: 'Test Style',
      origin: 'test',
      license: 'MIT',
      positive: 'beautiful',
      image: '/images/style1.png'
    }

    const mockData: StyleSection[] = [
      {
        id: 'section1',
        styles: [mockStyleItem]
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(mockData)
    )

    // Act
    const { result, rerender } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    const firstStyleItems = result.current.styleItems

    // Rerender without changing the data
    rerender()

    const secondStyleItems = result.current.styleItems

    // Assert
    expect(firstStyleItems).toBe(secondStyleItems) // Same reference due to memoization
  })

  it('should recalculate styleItems when styleSections data changes', () => {
    // Arrange
    const mockStyleItem1: StyleItem = {
      id: 'style1',
      name: 'Style 1',
      origin: 'test',
      license: 'MIT',
      positive: 'beautiful',
      image: '/images/style1.png'
    }

    const mockStyleItem2: StyleItem = {
      id: 'style2',
      name: 'Style 2',
      origin: 'test',
      license: 'Apache',
      positive: 'elegant',
      image: '/images/style2.png'
    }

    const initialData: StyleSection[] = [
      {
        id: 'section1',
        styles: [mockStyleItem1]
      }
    ]

    const updatedData: StyleSection[] = [
      {
        id: 'section1',
        styles: [mockStyleItem1, mockStyleItem2]
      }
    ]

    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(initialData)
    )

    // Act
    const { result, rerender } = renderHook(() => useStyleSections(), {
      wrapper: createQueryClientWrapper()
    })

    const initialStyleItems = result.current.styleItems
    expect(initialStyleItems).toEqual([mockStyleItem1])

    // Update the mock to return different data
    vi.mocked(useStyleSectionsQuery).mockReturnValue(
      createMockQueryResult(updatedData)
    )

    rerender()

    const updatedStyleItems = result.current.styleItems

    // Assert
    expect(updatedStyleItems).toEqual([mockStyleItem1, mockStyleItem2])
    expect(initialStyleItems).not.toBe(updatedStyleItems) // Different reference
  })
})

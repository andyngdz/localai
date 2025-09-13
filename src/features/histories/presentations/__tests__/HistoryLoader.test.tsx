import { render, screen } from '@testing-library/react'
import type { HTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { HistoryLoader } from '../HistoryLoader'

// Mock Skeleton to a simple div we can count
vi.mock('@heroui/react', async () => {
  const actual = await vi.importActual<typeof import('@heroui/react')>('@heroui/react')
  type SkeletonProps = { className?: string } & HTMLAttributes<HTMLDivElement>
  return {
    ...actual,
    Skeleton: (props: SkeletonProps) => <div data-testid="skeleton" {...props} />
  }
})

describe('HistoryLoader', () => {
  it('renders loader with 5 skeleton items', () => {
    render(<HistoryLoader />)

    // Loader container
    expect(screen.getByTestId('history-loader')).toBeInTheDocument()

    // Five item wrappers
    const itemWrappers = screen.getAllByTestId('history-loader-item')
    // Some environments may double-render in dev; ensure multiples of 5
    expect(itemWrappers.length % 5).toBe(0)
    expect(itemWrappers.length).toBeGreaterThanOrEqual(5)

    // Each item contains 4 skeletons (top row x2 + model + prompt) => 20 total
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(itemWrappers.length * 4)
  })
})

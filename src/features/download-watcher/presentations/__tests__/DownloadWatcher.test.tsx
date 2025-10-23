import { createQueryClientWrapper } from '@/cores/test-utils'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DownloadWatcher } from '../DownloadWatcher'

expect.extend(matchers)

// Mock useSocketEvent hook (simple mock since it's tested separately)
vi.mock('@/sockets', async () => {
  const actual = await vi.importActual('@/sockets')
  return {
    ...actual,
    useSocketEvent: vi.fn()
  }
})

describe('DownloadWatcher', () => {
  const QueryClientWrapper = createQueryClientWrapper()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders children without modification', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>

    const { getByTestId } = render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <TestChild />
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(getByTestId('test-child')).toBeTruthy()
    expect(getByTestId('test-child')).toHaveTextContent('Test Content')
  })

  it('component mounts and renders successfully', () => {
    const { container } = render(
      <QueryClientWrapper>
        <DownloadWatcher>
          <div>Child Content</div>
        </DownloadWatcher>
      </QueryClientWrapper>
    )

    expect(container).toBeTruthy()
  })
})

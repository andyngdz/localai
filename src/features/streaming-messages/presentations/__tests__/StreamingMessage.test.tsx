import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render, screen } from '@testing-library/react'
import type { MockInstance } from '@vitest/spy'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as useStreamingMessageModule from '../../states/useStreamingMessage'
import { StreamingMessage } from '../StreamingMessage'

expect.extend(matchers)

// Mock the FullScreenLoader component
vi.mock('@/cores/presentations', () => ({
  FullScreenLoader: ({ message }: { message: string }) => (
    <div data-testid="full-screen-loader">{message}</div>
  )
}))

describe('StreamingMessage', () => {
  let useStreamingMessageSpy: MockInstance

  beforeEach(() => {
    useStreamingMessageSpy = vi.spyOn(
      useStreamingMessageModule,
      'useStreamingMessage'
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('renders nothing when message is empty', () => {
    useStreamingMessageSpy.mockReturnValue({ message: '' })

    const { container } = render(<StreamingMessage />)
    expect(container.firstChild).toBeNull()
  })

  it('renders FullScreenLoader with message when message exists', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Downloading model' })

    render(<StreamingMessage />)

    expect(screen.getByText('Downloading model')).toBeTruthy()
    expect(screen.getByTestId('full-screen-loader')).toBeTruthy()
  })

  it('renders with different message content', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Loading...' })

    render(<StreamingMessage />)

    expect(screen.getByText('Loading...')).toBeTruthy()
    expect(screen.getByTestId('full-screen-loader')).toBeTruthy()
  })

  it('component structure includes overlay when message exists', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Test message' })

    const { container } = render(<StreamingMessage />)

    // Check that content is rendered
    expect(container.firstChild).not.toBeNull()
    expect(screen.getByText('Test message')).toBeTruthy()
  })
})

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup, render, screen } from '@testing-library/react';
import type { MockInstance } from '@vitest/spy';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as useStreamingMessageModule from '../../states/useStreamingMessage';
import { StreamingMessage } from '../StreamingMessage';

expect.extend(matchers);

// Mock the Lottie component
vi.mock('react-lottie', () => ({
  default: () => <div data-testid="lottie-animation">AI Animation</div>,
}));

// Mock the AI animation data
vi.mock('@/assets/ai.json', () => ({
  default: { mockAnimationData: true },
}));

describe('StreamingMessage', () => {
  let useStreamingMessageSpy: MockInstance;

  beforeEach(() => {
    useStreamingMessageSpy = vi.spyOn(useStreamingMessageModule, 'useStreamingMessage');
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders nothing when message is empty', () => {
    useStreamingMessageSpy.mockReturnValue({ message: '' });

    const { container } = render(<StreamingMessage />);
    expect(container.firstChild).toBeNull();
  });

  it('renders overlay with animation and message when message exists', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Downloading model' });

    render(<StreamingMessage />);

    expect(screen.getByText('Downloading model')).toBeTruthy();
    expect(screen.getByTestId('lottie-animation')).toBeTruthy();
  });

  it('renders with different message content', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Loading...' });

    render(<StreamingMessage />);

    expect(screen.getByText('Loading...')).toBeTruthy();
    expect(screen.getByTestId('lottie-animation')).toBeTruthy();
  });

  it('component structure includes overlay when message exists', () => {
    useStreamingMessageSpy.mockReturnValue({ message: 'Test message' });

    const { container } = render(<StreamingMessage />);

    // Check that content is rendered
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText('Test message')).toBeTruthy();
  });
});

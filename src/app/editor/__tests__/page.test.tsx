import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EditorScreen from '../page';

// Mock the Editor component
vi.mock('@/features/editors/presentations/Editor', () => ({
  Editor: () => <div data-testid="editor">Editor Component</div>,
}));

describe('EditorScreen', () => {
  it('renders Editor component', () => {
    render(<EditorScreen />);

    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByText('Editor Component')).toBeInTheDocument();
  });

  it('returns Editor as default export', () => {
    const { container } = render(<EditorScreen />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('has correct component structure', () => {
    const { container } = render(<EditorScreen />);

    // Should render only the Editor component
    expect(container.children).toHaveLength(1);
    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<EditorScreen />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

import type { ButtonProps, ChipProps } from '@heroui/react';
import type { PressEvent } from '@react-aria/interactions';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { ModelSearchViewHeaderProps } from '../ModelSearchViewHeader';
import { ModelSearchViewSpaces } from '../ModelSearchViewSpaces';

// Mock header to assert title
vi.mock('../ModelSearchViewHeader', () => ({
  ModelSearchViewHeader: ({ title }: ModelSearchViewHeaderProps) => (
    <div data-testid="header">title: {title}</div>
  ),
}));

// Mock avatar to avoid external requests and simplify DOM
vi.mock('@/cores/presentations/AuthorAvatar', () => ({
  AuthorAvatar: ({ id }: { id: string }) => <div data-testid="author-avatar">avatar-{id}</div>,
}));

// Mock heroui components with type-safe props
vi.mock('@heroui/react', async () => {
  // Dynamically import to get the actual types when available
  const actual = await vi.importActual('@heroui/react');
  return {
    ...actual,
    Button: ({ children, onPress, className }: ButtonProps) => (
      <button
        data-testid="toggle-button"
        className={className}
        onClick={() => onPress && onPress({} as PressEvent)}
      >
        {children}
      </button>
    ),
    Chip: ({ children }: ChipProps) => <div data-testid="chip">{children}</div>,
  };
});

describe('ModelSearchViewSpaces', () => {
  it('shows first 5 spaces by default and expands to all on click', async () => {
    // Arrange
    const user = userEvent.setup();
    const spaces = [
      'author1/space1',
      'author2/space2',
      'author3/space3',
      'author4/space4',
      'author5/space5',
      'author6/space6',
      'author7/space7',
    ];

    // Act
    render(<ModelSearchViewSpaces spaces={spaces} />);

    // Assert default state (first 5 chips only)
    expect(screen.getByTestId('header')).toHaveTextContent('title: Spaces');
    const chipsDefault = screen.getAllByTestId('chip');
    expect(chipsDefault).toHaveLength(5);
    expect(chipsDefault[0]).toHaveTextContent('author1/space1');
    expect(chipsDefault[4]).toHaveTextContent('author5/space5');
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('Show more');

    // Expand
    await user.click(screen.getByTestId('toggle-button'));

    const chipsExpanded = screen.getAllByTestId('chip');
    expect(chipsExpanded).toHaveLength(spaces.length);
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('Show less');

    // Collapse
    await user.click(screen.getByTestId('toggle-button'));

    const chipsCollapsed = screen.getAllByTestId('chip');
    expect(chipsCollapsed).toHaveLength(5);
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('Show more');
  });

  it('shows all spaces when 5 or fewer are provided and still toggles text', async () => {
    // Arrange
    const user = userEvent.setup();
    const spaces = ['a/1', 'b/2', 'c/3'];

    // Act
    render(<ModelSearchViewSpaces spaces={spaces} />);

    // Assert
    const chips = screen.getAllByTestId('chip');
    expect(chips).toHaveLength(3);
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('Show more');

    // Toggle still flips text to "Show less"
    await user.click(screen.getByTestId('toggle-button'));
    expect(screen.getByTestId('toggle-button')).toHaveTextContent('Show less');
  });
});

import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ModelSearchViewCard } from '../ModelSearchViewCard';
import type { ModelSearchViewHeaderProps } from '../ModelSearchViewHeader';

// Mock child components to stabilize DOM and assert props
vi.mock('../ModelSearchViewHeader', () => ({
  ModelSearchViewHeader: ({ title, href }: ModelSearchViewHeaderProps) => (
    <div data-testid="header">
      <div>title: {title}</div>
      <div>href: {href}</div>
    </div>
  ),
}));

vi.mock('@/cores/presentations/ModelWithAvatar', () => ({
  ModelWithAvatar: ({ author, id }: { author: string; id: string }) => (
    <div data-testid="model-with-avatar">
      <div>avatar-id: {id}</div>
      <div>avatar-author: {author}</div>
    </div>
  ),
}));

// Mock UI wrappers used from @heroui/react
vi.mock('@heroui/react', () => ({
  ScrollShadow: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div data-testid="scrollshadow" className={className}>
      {children}
    </div>
  ),
  Chip: ({ children }: { children: ReactNode }) => <div data-testid="chip">{children}</div>,
}));

describe('ModelSearchViewCard', () => {
  it('renders header, avatar, formatted stats, and tags', () => {
    render(
      <ModelSearchViewCard
        id="test-author/test-model-123"
        author="test-author"
        downloads={5000}
        likes={1000}
        tags={['tag1', 'tag2']}
      />,
    );

    // Header content and link
    const header = screen.getByTestId('header');
    expect(within(header).getByText('title: Model Card')).toBeInTheDocument();
    expect(
      within(header).getByText('href: https://huggingface.co/test-author/test-model-123'),
    ).toBeInTheDocument();

    // Avatar data
    const avatar = screen.getByTestId('model-with-avatar');
    expect(within(avatar).getByText('avatar-id: test-author/test-model-123')).toBeInTheDocument();
    expect(within(avatar).getByText('avatar-author: test-author')).toBeInTheDocument();

    // Static label
    expect(screen.getByText('Text to Image')).toBeInTheDocument();

    // Formatted numbers (en-US)
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();

    // Tags rendered (via mocked Chip)
    const chips = screen.getAllByTestId('chip');
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent('tag1');
    expect(chips[1]).toHaveTextContent('tag2');
  });

  it('renders without tags when tags array is empty', () => {
    render(
      <ModelSearchViewCard id="test/model" author="author" downloads={0} likes={0} tags={[]} />,
    );

    // Still shows header and avatar
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('model-with-avatar')).toBeInTheDocument();

    // No chips when no tags
    expect(screen.queryByTestId('chip')).not.toBeInTheDocument();
  });
});

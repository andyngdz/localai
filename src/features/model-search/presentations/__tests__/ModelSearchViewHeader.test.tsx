import { render, screen } from '@testing-library/react'
import type { LucideProps } from 'lucide-react'
import type { FC } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ButtonProps } from '@heroui/react'
import { ModelSearchViewHeader } from '../ModelSearchViewHeader'

// Mock only the Button from @heroui/react to a simple anchor/button
vi.mock('@heroui/react', () => ({
  Button: ({ children, href, target, className }: ButtonProps) => {
    if (href) {
      return (
        <a
          data-testid="button-link"
          href={href}
          target={target}
          className={className}
        >
          {children}
        </a>
      )
    }
    return (
      <button data-testid="button" className={className}>
        {children}
      </button>
    )
  }
}))

// Provide a lightweight Icon implementation to assert it renders and receives className
const DummyIcon: FC<LucideProps> = (props) => (
  <svg data-testid="icon" {...props} />
)

describe('ModelSearchViewHeader', () => {
  it('renders icon and title without action button when href is not provided', () => {
    // Arrange & Act
    render(<ModelSearchViewHeader Icon={DummyIcon} title="Model Card" />)

    // Assert
    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-primary')
    expect(screen.getByText('Model Card')).toBeInTheDocument()
    expect(screen.queryByTestId('button-link')).not.toBeInTheDocument()
  })

  it('renders external link button when href is provided', () => {
    // Arrange
    const href = 'https://huggingface.co/author/model'

    // Act
    render(
      <ModelSearchViewHeader Icon={DummyIcon} title="Model Card" href={href} />
    )

    // Assert
    const link = screen.getByTestId('button-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveClass('text-default-700')
  })
})

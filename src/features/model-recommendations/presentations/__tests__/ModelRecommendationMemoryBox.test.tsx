import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ModelRecommendationMemoryBox,
  ModelRecommendationMemoryBoxProps
} from '../ModelRecommendationMemoryBox'

describe('ModelRecommendationMemoryBox', () => {
  const defaultProps: ModelRecommendationMemoryBoxProps = {
    icon: <span data-testid="test-icon">🔍</span>,
    content: '8GB'
  }

  it('renders the icon and content correctly', () => {
    render(<ModelRecommendationMemoryBox {...defaultProps} />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('8GB')).toBeInTheDocument()
  })

  it('applies the correct styling classes', () => {
    const { container } = render(
      <ModelRecommendationMemoryBox {...defaultProps} />
    )

    // Check main container has the expected classes
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('w-24')
    expect(mainDiv).toHaveClass('flex')
    expect(mainDiv).toHaveClass('items-center')
    expect(mainDiv).toHaveClass('gap-2')

    // Check icon has text-muted-content class
    const iconSpan = screen.getByTestId('test-icon').parentElement
    expect(iconSpan).toHaveClass('text-muted-content')

    // Check content has the expected classes
    const contentSpan = screen.getByText('8GB').closest('span')
    expect(contentSpan).toHaveClass('text-sm')
    expect(contentSpan).toHaveClass('font-bold')
    expect(contentSpan).toHaveClass('text-base-content')
  })

  it('renders different content values correctly', () => {
    const customProps = {
      ...defaultProps,
      content: '16GB'
    }

    render(<ModelRecommendationMemoryBox {...customProps} />)
    expect(screen.getByText('16GB')).toBeInTheDocument()
  })

  it('renders different icon correctly', () => {
    const customProps = {
      ...defaultProps,
      icon: <span data-testid="different-icon">💾</span>
    }

    render(<ModelRecommendationMemoryBox {...customProps} />)
    expect(screen.getByTestId('different-icon')).toBeInTheDocument()
  })
})

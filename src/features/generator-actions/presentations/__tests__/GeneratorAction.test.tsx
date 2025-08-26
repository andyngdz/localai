import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GeneratorAction } from '../GeneratorAction'

// Mock the GeneratorActionSubmitButton component
vi.mock('../GeneratorActionSubmitButton', () => ({
  GeneratorActionSubmitButton: () => <div data-testid="submit-button-mock">Submit Button</div>
}))

// Mock HeroUI components
vi.mock('@heroui/react', () => ({
  Select: ({
    children,
    className,
    defaultSelectedKeys,
    'aria-label': ariaLabel
  }: {
    children: React.ReactNode
    className?: string
    defaultSelectedKeys?: string[]
    'aria-label'?: string
  }) => (
    <div data-testid="select-mock" className={className} aria-label={ariaLabel}>
      {defaultSelectedKeys && <span data-testid="selected-key">{defaultSelectedKeys[0]}</span>}
      {children}
    </div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-item">{children}</div>
  )
}))

describe('GeneratorAction', () => {
  it('should render the component with submit button and view selector', () => {
    // Act
    render(<GeneratorAction />)

    // Assert
    expect(screen.getByTestId('submit-button-mock')).toBeInTheDocument()
    expect(screen.getByTestId('select-mock')).toBeInTheDocument()
    expect(screen.getByTestId('selected-key')).toHaveTextContent('grid')

    // Check for SelectItem content
    const selectItems = screen.getAllByTestId('select-item')
    expect(selectItems).toHaveLength(2)
    expect(selectItems[0]).toHaveTextContent('Grid View')
    expect(selectItems[1]).toHaveTextContent('List View')
  })

  it('should have the correct CSS classes and attributes', () => {
    // Act
    render(<GeneratorAction />)

    // Assert
    expect(screen.getByTestId('select-mock')).toHaveClass('max-w-32')
    expect(screen.getByTestId('select-mock')).toHaveAttribute('aria-label', 'View')
  })
})

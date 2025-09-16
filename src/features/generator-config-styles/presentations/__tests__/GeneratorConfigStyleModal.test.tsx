import { StyleSection } from '@/types'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GeneratorConfigStyleModal } from '../GeneratorConfigStyleModal'

// Mock HeroUI components
vi.mock('@heroui/react', async () => {
  const actual = await vi.importActual<typeof import('@heroui/react')>('@heroui/react')
  return {
    ...actual,
    Modal: ({
      children,
      placement,
      size,
      scrollBehavior,
      isOpen,
      backdrop,
      isDismissable,
      ...props
    }: {
      children: React.ReactNode
      placement?: string
      size?: string
      scrollBehavior?: string
      isOpen?: boolean
      onOpenChange?: () => void
      backdrop?: string
      isDismissable?: boolean
      [key: string]: unknown
    }) => (
      <div
        data-testid="modal"
        data-placement={placement}
        data-size={size}
        data-scroll-behavior={scrollBehavior}
        data-is-open={isOpen}
        data-backdrop={backdrop}
        data-is-dismissable={isDismissable}
        {...props}
      >
        {children}
      </div>
    ),
    ModalContent: ({
      children,
      ...props
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => (
      <div data-testid="modal-content" {...props}>
        {children}
      </div>
    ),
    ModalHeader: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode
      className?: string
      [key: string]: unknown
    }) => (
      <div data-testid="modal-header" className={className} {...props}>
        {children}
      </div>
    ),
    ModalBody: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div data-testid="modal-body" {...props}>
        {children}
      </div>
    ),
    Chip: ({
      children,
      color,
      variant,
      size,
      className,
      role,
      ...props
    }: {
      children: React.ReactNode
      color?: string
      variant?: string
      size?: string
      className?: string
      role?: string
      [key: string]: unknown
    }) => (
      <span
        data-testid="chip"
        data-color={color}
        data-variant={variant}
        data-size={size}
        className={className}
        role={role}
        {...props}
      >
        {children}
      </span>
    )
  }
})

// Mock GeneratorConfigStyleSection component
vi.mock('../GeneratorConfigStyleSection', () => ({
  GeneratorConfigStyleSection: ({ styleSections }: { styleSections: StyleSection[] }) => (
    <div data-testid="generator-config-style-section">
      {styleSections.map((section) => (
        <div key={section.id} data-testid={`style-section-${section.id}`}>
          {section.styles.length} styles
        </div>
      ))}
    </div>
  )
}))

describe('GeneratorConfigStyleModal', () => {
  const mockStyleSections: StyleSection[] = [
    {
      id: 'abstract',
      styles: [
        {
          id: 'style-1',
          name: 'Abstract Style 1',
          origin: 'Test Origin',
          license: 'MIT',
          positive: 'abstract, colorful',
          negative: 'realistic',
          image: '/test-image-1.jpg'
        },
        {
          id: 'style-2',
          name: 'Abstract Style 2',
          origin: 'Test Origin 2',
          license: 'CC0',
          positive: 'surreal, artistic',
          image: '/test-image-2.jpg'
        }
      ]
    },
    {
      id: 'realistic',
      styles: [
        {
          id: 'style-3',
          name: 'Realistic Style 1',
          origin: 'Test Origin 3',
          license: 'GPL',
          positive: 'photorealistic, detailed',
          negative: 'cartoon',
          image: '/test-image-3.jpg'
        }
      ]
    }
  ]

  const defaultProps = {
    styleSections: mockStyleSections,
    isOpen: true,
    onOpenChange: vi.fn()
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('renders modal with correct structure', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      expect(screen.getByTestId('modal')).toBeInTheDocument()
      expect(screen.getByTestId('modal-content')).toBeInTheDocument()
      expect(screen.getByTestId('modal-header')).toBeInTheDocument()
      expect(screen.getByTestId('modal-body')).toBeInTheDocument()
    })

    it('renders modal header with correct title', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      const header = screen.getByTestId('modal-header')
      expect(header).toHaveTextContent('Styles')
    })

    it('renders NSFW warning chip with correct content', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveTextContent(
        'Some styles may contain NSFW content. Please preview before applying'
      )
      expect(chip).toHaveAttribute('data-color', 'warning')
      expect(chip).toHaveAttribute('data-variant', 'flat')
      expect(chip).toHaveAttribute('data-size', 'sm')
      expect(chip).toHaveAttribute('role', 'alert')
    })

    it('renders GeneratorConfigStyleSection with style sections', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      expect(screen.getByTestId('generator-config-style-section')).toBeInTheDocument()
      expect(screen.getByTestId('style-section-abstract')).toHaveTextContent('2 styles')
      expect(screen.getByTestId('style-section-realistic')).toHaveTextContent('1 styles')
    })
  })

  describe('Modal Configuration', () => {
    it('applies correct modal placement, size, and scroll behavior', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('data-placement', 'bottom')
      expect(modal).toHaveAttribute('data-size', '2xl')
      expect(modal).toHaveAttribute('data-scroll-behavior', 'inside')
    })

    it('forwards modal props correctly', () => {
      const mockOnOpenChange = vi.fn()
      const additionalProps = {
        isOpen: false,
        onOpenChange: mockOnOpenChange,
        backdrop: 'blur' as const,
        isDismissable: false
      }

      render(<GeneratorConfigStyleModal {...defaultProps} {...additionalProps} />)

      const modal = screen.getByTestId('modal')
      expect(modal).toHaveAttribute('data-is-open', 'false')
      expect(modal).toHaveAttribute('data-backdrop', 'blur')
      expect(modal).toHaveAttribute('data-is-dismissable', 'false')
    })
  })

  describe('Header Styling', () => {
    it('applies correct CSS classes to modal header', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      const header = screen.getByTestId('modal-header')
      expect(header).toHaveClass('flex', 'justify-between', 'items-center', 'gap-2')
    })

    it('applies correct CSS classes to warning chip', () => {
      render(<GeneratorConfigStyleModal {...defaultProps} />)

      const chip = screen.getByTestId('chip')
      expect(chip).toHaveClass('mr-4')
    })
  })

  describe('Edge Cases', () => {
    it('renders with empty style sections array', () => {
      const emptyProps = {
        ...defaultProps,
        styleSections: []
      }

      render(<GeneratorConfigStyleModal {...emptyProps} />)

      expect(screen.getByTestId('modal')).toBeInTheDocument()
      expect(screen.getByTestId('generator-config-style-section')).toBeInTheDocument()
      expect(screen.queryByTestId(/style-section-/)).not.toBeInTheDocument()
    })

    it('renders with single style section', () => {
      const singleSectionProps = {
        ...defaultProps,
        styleSections: [mockStyleSections[0]]
      }

      render(<GeneratorConfigStyleModal {...singleSectionProps} />)

      expect(screen.getByTestId('style-section-abstract')).toBeInTheDocument()
      expect(screen.queryByTestId('style-section-realistic')).not.toBeInTheDocument()
    })

    it('handles style sections with no styles', () => {
      const emptySectionProps = {
        ...defaultProps,
        styleSections: [
          {
            id: 'empty-section',
            styles: []
          }
        ]
      }

      render(<GeneratorConfigStyleModal {...emptySectionProps} />)

      expect(screen.getByTestId('style-section-empty-section')).toHaveTextContent('0 styles')
    })
  })

  describe('Props Interface', () => {
    it('accepts all required props', () => {
      const minimalProps = {
        styleSections: mockStyleSections
      }

      expect(() => render(<GeneratorConfigStyleModal {...minimalProps} />)).not.toThrow()
    })

    it('omits children prop from ModalProps', () => {
      // This test ensures the interface correctly omits 'children' from ModalProps
      // TypeScript compilation will catch if this interface is incorrect
      const propsWithoutChildren = {
        styleSections: mockStyleSections,
        isOpen: true,
        onOpenChange: vi.fn(),
        backdrop: 'blur' as const
        // children should not be allowed here
      }

      expect(() => render(<GeneratorConfigStyleModal {...propsWithoutChildren} />)).not.toThrow()
    })
  })
})

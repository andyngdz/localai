import { ModelRecommendationSection } from '@/types/api'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ModelRecommendationsList } from '../ModelRecommendationsList'

// Mock CSS imports
vi.mock('swiper/css', () => ({}))
vi.mock('swiper/css/pagination', () => ({}))

// Mock Swiper components and modules with simplified implementation
vi.mock('swiper/react', () => ({
  Swiper: ({ children, initialSlide }: { children: React.ReactNode; initialSlide?: number }) => (
    <div data-testid="swiper" data-initial-slide={initialSlide}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="swiper-slide" className={className}>
      {children}
    </div>
  )
}))

// Mock ModelRecommendationsSection component
vi.mock('../ModelRecommendationsSection', () => ({
  ModelRecommendationsSection: ({
    section,
    isDefaultRecommended
  }: {
    section: ModelRecommendationSection
    isDefaultRecommended: boolean
  }) => (
    <div
      data-testid="model-recommendations-section"
      data-section-id={section.id}
      data-is-default-recommended={isDefaultRecommended.toString()}
    >
      {section.name}
    </div>
  )
}))

// Mock the es-toolkit findIndex function with the native implementation
vi.mock('es-toolkit/compat', () => ({
  findIndex: (arr: unknown[], predicate: (item: unknown) => boolean) => arr.findIndex(predicate)
}))

// Mock Swiper modules
vi.mock('swiper/modules', () => ({
  Pagination: {}
}))

describe('ModelRecommendationsList', () => {
  const mockSections: ModelRecommendationSection[] = [
    {
      id: 'section1',
      name: 'Section 1',
      description: 'Description 1',
      models: [],
      is_recommended: false
    },
    {
      id: 'section2',
      name: 'Section 2',
      description: 'Description 2',
      models: [],
      is_recommended: true
    },
    {
      id: 'section3',
      name: 'Section 3',
      description: 'Description 3',
      models: [],
      is_recommended: false
    }
  ]

  it('renders swiper component with correct initialSlide', () => {
    render(<ModelRecommendationsList sections={mockSections} defaultSection="section2" />)

    const swiper = screen.getByTestId('swiper')
    expect(swiper).toBeInTheDocument()
    expect(swiper).toHaveAttribute('data-initial-slide', '1') // section2 is at index 1
  })

  it('renders correct number of slides', () => {
    render(<ModelRecommendationsList sections={mockSections} defaultSection="section1" />)

    const slides = screen.getAllByTestId('swiper-slide')
    expect(slides).toHaveLength(3)
  })

  it('passes correct props to ModelRecommendationsSection', () => {
    render(<ModelRecommendationsList sections={mockSections} defaultSection="section2" />)

    const sections = screen.getAllByTestId('model-recommendations-section')

    // Check section IDs
    expect(sections[0]).toHaveAttribute('data-section-id', 'section1')
    expect(sections[1]).toHaveAttribute('data-section-id', 'section2')
    expect(sections[2]).toHaveAttribute('data-section-id', 'section3')

    // Check isDefaultRecommended flag
    expect(sections[0]).toHaveAttribute('data-is-default-recommended', 'false')
    expect(sections[1]).toHaveAttribute('data-is-default-recommended', 'true')
    expect(sections[2]).toHaveAttribute('data-is-default-recommended', 'false')
  })

  it('renders section names inside each slide', () => {
    render(<ModelRecommendationsList sections={mockSections} defaultSection="section1" />)

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByText('Section 3')).toBeInTheDocument()
  })

  it('applies correct styling to container', () => {
    const { container } = render(
      <ModelRecommendationsList sections={mockSections} defaultSection="section1" />
    )

    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('max-w-2xl')
  })

  it('applies correct classes to slides', () => {
    render(<ModelRecommendationsList sections={mockSections} defaultSection="section1" />)

    const slides = screen.getAllByTestId('swiper-slide')
    slides.forEach((slide) => {
      expect(slide).toHaveClass('max-w-4/5')
      expect(slide).toHaveClass('pb-8')
    })
  })
})

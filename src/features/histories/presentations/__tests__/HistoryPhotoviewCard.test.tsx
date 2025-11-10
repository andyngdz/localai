import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { dateFormatter } from '@/services'
import { HistoryItem } from '@/types'
import { HistoryPhotoviewCard } from '../HistoryPhotoviewCard'

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="next-image" data-src={src} data-alt={alt} />
  )
}))

vi.mock('@/services', () => ({
  dateFormatter: {
    time: vi.fn().mockReturnValue('2024-01-15 10:30 AM')
  }
}))

vi.mock('../HistoryPhotoviewConfigRow', () => ({
  HistoryPhotoviewConfigRow: ({
    label,
    value
  }: {
    label: string
    value: string | number | string[]
  }) => (
    <div data-testid="config-row" data-label={label} data-value={String(value)}>
      {label}: {String(value)}
    </div>
  )
}))

describe('HistoryPhotoviewCard', () => {
  const mockHistory: HistoryItem = {
    id: 1,
    created_at: '2024-01-15T10:30:00',
    updated_at: '2024-01-15T10:30:00',
    prompt: 'A beautiful landscape',
    model: 'stable-diffusion-v1-5',
    config: {
      width: 512,
      height: 768,
      steps: 25,
      cfg_scale: 7.5,
      sampler: 'Euler a',
      seed: 12345,
      number_of_images: 4,
      hires_fix: true,
      prompt: 'A beautiful landscape',
      negative_prompt: 'blurry, low quality',
      styles: ['anime', 'fantasy']
    },
    generated_images: [
      {
        id: 101,
        path: 'static/images/image1.png',
        is_nsfw: false,
        file_name: 'image1.png',
        created_at: '2024-01-15T10:30:00',
        updated_at: '2024-01-15T10:30:00',
        history_id: 1
      },
      {
        id: 102,
        path: 'static/images/image2.png',
        is_nsfw: false,
        file_name: 'image2.png',
        created_at: '2024-01-15T10:30:00',
        updated_at: '2024-01-15T10:30:00',
        history_id: 1
      }
    ]
  }

  it('should render header with formatted time and model', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    expect(dateFormatter.time).toHaveBeenCalledWith('2024-01-15T10:30:00Z')
    expect(screen.getByText('2024-01-15 10:30 AM')).toBeInTheDocument()
    expect(screen.getByText('stable-diffusion-v1-5')).toBeInTheDocument()
  })

  it('should render generated images grid', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    const images = screen.getAllByTestId('next-image')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute(
      'data-src',
      'http://localhost:8000/static/images/image1.png'
    )
    expect(images[0]).toHaveAttribute('data-alt', 'Generated image 1')
    expect(images[1]).toHaveAttribute(
      'data-src',
      'http://localhost:8000/static/images/image2.png'
    )
    expect(images[1]).toHaveAttribute('data-alt', 'Generated image 2')
  })

  it('should not render images grid when no images', () => {
    const historyWithoutImages: HistoryItem = {
      ...mockHistory,
      generated_images: []
    }

    render(<HistoryPhotoviewCard history={historyWithoutImages} />)

    expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
  })

  it('should render Configuration section header', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    expect(screen.getByText('Configuration')).toBeInTheDocument()
  })

  it('should render all config rows', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    const configRows = screen.getAllByTestId('config-row')
    expect(configRows.length).toBeGreaterThan(10)

    expect(screen.getByText(/Prompt:/)).toBeInTheDocument()
    expect(screen.getByText(/Width:/)).toBeInTheDocument()
    expect(screen.getByText(/Height:/)).toBeInTheDocument()
    expect(screen.getByText(/Steps:/)).toBeInTheDocument()
    expect(screen.getByText(/CFG Scale:/)).toBeInTheDocument()
    expect(screen.getByText(/Sampler:/)).toBeInTheDocument()
    expect(screen.getByText(/Seed:/)).toBeInTheDocument()
    expect(screen.getByText(/Number of Images:/)).toBeInTheDocument()
    expect(screen.getByText(/Hires Fix:/)).toBeInTheDocument()
    expect(screen.getByText(/Styles:/)).toBeInTheDocument()
  })

  it('should display "Random" for seed value -1', () => {
    const historyWithRandomSeed: HistoryItem = {
      ...mockHistory,
      config: {
        ...mockHistory.config,
        seed: -1
      }
    }

    render(<HistoryPhotoviewCard history={historyWithRandomSeed} />)

    const seedRow = screen
      .getAllByTestId('config-row')
      .find((row) => row.getAttribute('data-label') === 'Seed')

    expect(seedRow).toHaveAttribute('data-value', 'Random')
  })

  it('should display "Yes" for hires_fix true', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    const hiresRow = screen
      .getAllByTestId('config-row')
      .find((row) => row.getAttribute('data-label') === 'Hires Fix')

    expect(hiresRow).toHaveAttribute('data-value', 'Yes')
  })

  it('should display "No" for hires_fix false', () => {
    const historyWithoutHiresFix: HistoryItem = {
      ...mockHistory,
      config: {
        ...mockHistory.config,
        hires_fix: false
      }
    }

    render(<HistoryPhotoviewCard history={historyWithoutHiresFix} />)

    const hiresRow = screen
      .getAllByTestId('config-row')
      .find((row) => row.getAttribute('data-label') === 'Hires Fix')

    expect(hiresRow).toHaveAttribute('data-value', 'No')
  })

  it('should display "None" for empty negative prompt', () => {
    const historyWithoutNegativePrompt: HistoryItem = {
      ...mockHistory,
      config: {
        ...mockHistory.config,
        negative_prompt: ''
      }
    }

    render(<HistoryPhotoviewCard history={historyWithoutNegativePrompt} />)

    const negativePromptRow = screen
      .getAllByTestId('config-row')
      .find((row) => row.getAttribute('data-label') === 'Negative Prompt')

    expect(negativePromptRow).toHaveAttribute('data-value', 'None')
  })

  it('should render multiple generated images in responsive grid', () => {
    const historyWithManyImages: HistoryItem = {
      ...mockHistory,
      generated_images: [
        ...mockHistory.generated_images,
        {
          id: 103,
          path: 'static/images/image3.png',
          is_nsfw: false,
          file_name: 'image3.png',
          created_at: '2024-01-15T10:30:00',
          updated_at: '2024-01-15T10:30:00',
          history_id: 1
        },
        {
          id: 104,
          path: 'static/images/image4.png',
          is_nsfw: false,
          file_name: 'image4.png',
          created_at: '2024-01-15T10:30:00',
          updated_at: '2024-01-15T10:30:00',
          history_id: 1
        }
      ]
    }

    render(<HistoryPhotoviewCard history={historyWithManyImages} />)

    const images = screen.getAllByTestId('next-image')
    expect(images).toHaveLength(4)
  })

  it('should render model in both header and config', () => {
    render(<HistoryPhotoviewCard history={mockHistory} />)

    expect(screen.getAllByText(/stable-diffusion-v1-5/)).toHaveLength(2)
  })
})

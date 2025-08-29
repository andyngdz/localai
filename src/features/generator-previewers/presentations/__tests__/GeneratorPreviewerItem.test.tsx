import { mockNextImage } from '@/cores/test-utils'
import { render } from '@testing-library/react'
import { useFormContext } from 'react-hook-form'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGeneratorPreviewer } from '../../states'
import { GeneratorPreviewerItem, GeneratorPreviewerItemProps } from '../GeneratorPreviewerItem'

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn()
}))

vi.mock('@/features/generator-previewers/states', () => ({
  useGeneratorPreviewer: vi.fn()
}))

vi.mock('next/image', () => mockNextImage())

describe('GeneratorPreviewerItem', () => {
  const mockWatch = vi.fn()
  const mockUseGeneratorPreviewer = vi.mocked(useGeneratorPreviewer)

  beforeEach(() => {
    // @ts-expect-error - We're only mocking the watch method that the component uses
    vi.mocked(useFormContext).mockReturnValue({ watch: mockWatch })
    mockWatch.mockImplementation((field: string) => {
      if (field === 'width') return 512
      if (field === 'height') return 512
      return 0
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps: GeneratorPreviewerItemProps = {
    imageStepEnd: {
      index: 0,
      current_step: 0,
      timestep: 0,
      image_base64: ''
    }
  }

  it('should render a skeleton when image is empty', () => {
    mockUseGeneratorPreviewer.mockReturnValue({
      items: [{ path: '', file_name: '' }],
      imageStepEnds: [],
    })

    const { container } = render(<GeneratorPreviewerItem {...defaultProps} />)
    expect(container.querySelector('.rounded-2xl')).not.toBeNull()
  })

  it('should render NextImage with base64 when image is generated and path is not available', () => {
    mockUseGeneratorPreviewer.mockReturnValue({
      items: [{ path: '', file_name: '' }],
      imageStepEnds: [],
    })

    const props: GeneratorPreviewerItemProps = {
      ...defaultProps,
      imageStepEnd: {
        ...defaultProps.imageStepEnd,
        image_base64: 'test-base64-string'
      }
    }

    const { getByTestId } = render(<GeneratorPreviewerItem {...props} />)
    const image = getByTestId('mock-next-image')
    expect(image.getAttribute('data-src')).toBe('data:image/png;base64,test-base64-string')
  })

  it('should render NextImage with http URL when image path is available', () => {
    mockUseGeneratorPreviewer.mockReturnValue({
      items: [{ path: 'images/test.png', file_name: 'test.png' }],
      imageStepEnds: [],
    })

    const props: GeneratorPreviewerItemProps = {
      ...defaultProps,
      imageStepEnd: {
        ...defaultProps.imageStepEnd,
        image_base64: 'test-base64-string'
      }
    }

    const { getByTestId } = render(<GeneratorPreviewerItem {...props} />)
    const image = getByTestId('mock-next-image')
    expect(image.getAttribute('data-src')).toBe('http://localhost:8000/images/test.png')
  })
})

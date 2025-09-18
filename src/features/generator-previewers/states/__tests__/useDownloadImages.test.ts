import { invoke } from '@tauri-apps/api/core'
import { useDownloadImages } from '@/features/generator-previewers/states/useDownloadImages'
import { addToast } from '@heroui/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn()
}))

vi.mock('@heroui/react', async () => {
  const actual = await vi.importActual<typeof import('@heroui/react')>('@heroui/react')
  return {
    ...actual,
    addToast: vi.fn()
  }
})

describe('useDownloadImages', () => {
  const testUrl = 'https://example.com/image.png'
  let mockInvoke: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockInvoke = vi.mocked(invoke)
    mockInvoke.mockResolvedValue(undefined)
  })

  afterEach(() => {
    mockInvoke.mockReset()
  })

  it('invokes the download_image command with given URL', async () => {
    const { onDownloadImage } = useDownloadImages()

    await onDownloadImage(testUrl)

    expect(mockInvoke).toHaveBeenCalledTimes(1)
    expect(mockInvoke).toHaveBeenCalledWith('download_image', { url: testUrl })
    expect(vi.mocked(addToast)).not.toHaveBeenCalled()
  })

  it('shows warning toast with error message when download fails with Error', async () => {
    const expectedError = new Error('boom')
    mockInvoke.mockRejectedValueOnce(expectedError)
    const { onDownloadImage } = useDownloadImages()

    await onDownloadImage(testUrl)

    expect(vi.mocked(addToast)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(addToast)).toHaveBeenCalledWith({
      title: 'Failed to download image',
      description: 'boom',
      color: 'warning'
    })
  })

  it('shows warning toast with default message when download fails with non-Error', async () => {
    mockInvoke.mockRejectedValueOnce('some-failure')
    const { onDownloadImage } = useDownloadImages()

    await onDownloadImage(testUrl)

    expect(vi.mocked(addToast)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(addToast)).toHaveBeenCalledWith({
      title: 'Failed to download image',
      description: 'Unknown error occurred',
      color: 'warning'
    })
  })
})

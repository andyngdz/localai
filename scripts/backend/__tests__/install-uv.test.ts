import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BackendStatusLevel } from '@types'

const { mock$ } = vi.hoisted(() => ({
  mock$: vi.fn()
}))

vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

const { mockNormalizeError } = vi.hoisted(() => ({
  mockNormalizeError: vi.fn<(error: unknown, defaultMessage: string) => Error>()
}))

let mockIsWindows = false

vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils')
  return {
    ...actual,
    get isWindows() {
      return mockIsWindows
    },
    normalizeError: mockNormalizeError
  }
})

import { installUv } from '../install-uv'

type ProcessResult = {
  exitCode: number
  stdout: string
  stderr?: string
}

const makeProcessResult = (
  overrides: Partial<ProcessResult> = {}
): ProcessResult => ({
  exitCode: 0,
  stdout: '',
  stderr: '',
  ...overrides
})

describe('installUv', () => {
  beforeEach(() => {
    mock$.mockReset()
    mockNormalizeError.mockReset()

    mockIsWindows = false
    mockNormalizeError.mockImplementation(
      (error: unknown, defaultMessage: string) =>
        error instanceof Error ? error : new Error(defaultMessage)
    )
  })

  it('returns the detected uv version when already installed', async () => {
    mock$.mockReturnValueOnce({
      nothrow: () =>
        Promise.resolve(makeProcessResult({ stdout: 'uv 0.2.0\n' }))
    })

    const emit = vi.fn()
    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.2.0' })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.2.0 already installed.'
    })
    expect(mock$).toHaveBeenCalledTimes(1)
    expect(mockNormalizeError).not.toHaveBeenCalled()
  })

  it('installs uv on Unix-like systems when missing', async () => {
    mock$
      .mockReturnValueOnce({
        nothrow: () => Promise.resolve(makeProcessResult({ exitCode: 1 }))
      })
      .mockImplementationOnce(
        (strings: TemplateStringsArray, command: string) => {
          expect(strings).toEqual(['', ''])
          expect(command).toBe(
            'curl -LsSf https://astral.sh/uv/install.sh | sh'
          )
          return Promise.resolve()
        }
      )
      .mockReturnValueOnce({
        nothrow: () =>
          Promise.resolve(makeProcessResult({ stdout: 'uv 0.9.0\n' }))
      })

    const emit = vi.fn()
    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.9.0' })
    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Info,
      message: 'uv 0.9.0 installed successfully.'
    })
    expect(mock$).toHaveBeenCalledTimes(3)
  })

  it('uses the Windows installation command when running on Windows', async () => {
    mockIsWindows = true

    mock$
      .mockReturnValueOnce({
        nothrow: () => Promise.resolve(makeProcessResult({ exitCode: 1 }))
      })
      .mockImplementationOnce(
        (strings: TemplateStringsArray, command: string) => {
          expect(strings).toEqual(['', ''])
          expect(command).toContain('powershell -ExecutionPolicy ByPass')
          return Promise.resolve()
        }
      )
      .mockReturnValueOnce({
        nothrow: () =>
          Promise.resolve(makeProcessResult({ stdout: 'uv 1.1.0\n' }))
      })

    const emit = vi.fn()
    const result = await installUv({ emit })

    expect(result).toEqual({ version: '1.1.0' })
    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Info,
      message: 'uv 1.1.0 installed successfully.'
    })
  })

  it('emits an error with manual commands when installation fails', async () => {
    const installError = new Error('install failed')

    mock$
      .mockReturnValueOnce({
        nothrow: () => Promise.resolve(makeProcessResult({ exitCode: 1 }))
      })
      .mockImplementationOnce(() => Promise.reject(installError))

    const normalizedError = new Error('normalized error')
    mockNormalizeError.mockReturnValue(normalizedError)

    const emit = vi.fn()

    await expect(installUv({ emit })).rejects.toThrow('normalized error')

    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Error,
      message: 'uv installation failed. Run the command manually.',
      commands: [
        {
          label: 'Install with shell script',
          command: 'curl -LsSf https://astral.sh/uv/install.sh | sh'
        }
      ]
    })
    expect(mockNormalizeError).toHaveBeenCalledWith(
      installError,
      'Failed to install uv via provided command.'
    )
  })

  it('throws when version cannot be detected after installation', async () => {
    mock$
      .mockReturnValueOnce({
        nothrow: () => Promise.resolve(makeProcessResult({ exitCode: 1 }))
      })
      .mockImplementationOnce(() => Promise.resolve())
      .mockReturnValueOnce({
        nothrow: () => Promise.resolve(makeProcessResult({ stdout: '' }))
      })

    const emit = vi.fn()

    await expect(installUv({ emit })).rejects.toThrow(
      'uv installation completed but could not verify version.'
    )

    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Error,
      message: 'uv installation finished but version could not be detected.'
    })
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BackendStatusLevel } from '../types'

const mock$ = vi.fn()

vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

const mockIsWindows = vi.fn()
const mockIsLinux = vi.fn()
const mockIsMac = vi.fn()

vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils')
  return {
    ...actual,
    isWindows: mockIsWindows,
    isLinux: mockIsLinux,
    isMac: mockIsMac
  }
})

const makeProcessOutput = (
  overrides: Partial<{ exitCode: number; stdout: string; stderr: string }>
) => ({
  exitCode: 0,
  stdout: '',
  stderr: '',
  ...overrides
})

const setPlatform = (platform: NodeJS.Platform) => {
  mockIsWindows.mockReturnValue(platform === 'win32')
  mockIsLinux.mockReturnValue(platform === 'linux')
  mockIsMac.mockReturnValue(platform === 'darwin')
}

const getInstallUv = async () => {
  // Clear module cache to ensure fresh import with current mocks
  vi.resetModules()
  // Force mock the utils module
  vi.doMock('../utils', () => ({
    isWindows: mockIsWindows(),
    isLinux: mockIsLinux(),
    isMac: mockIsMac(),
    normalizeError: vi
      .fn()
      .mockImplementation((error, defaultMessage) =>
        error instanceof Error ? error : new Error(defaultMessage)
      ),
    pathExists: vi.fn()
  }))
  const installUvModule = await import('../install-uv')
  return installUvModule.installUv
}

beforeEach(() => {
  mock$.mockReset()
  // Reset all platform mocks to false first
  mockIsWindows.mockReturnValue(false)
  mockIsLinux.mockReturnValue(false)
  mockIsMac.mockReturnValue(false)
})

afterEach(() => {
  mock$.mockReset()
  mockIsWindows.mockReset()
  mockIsLinux.mockReset()
  mockIsMac.mockReset()
})

describe('installUv', () => {
  it('emits a success message when uv is already installed', async () => {
    setPlatform('linux')

    mock$.mockImplementation(() => {
      return {
        nothrow: () =>
          Promise.resolve(makeProcessOutput({ stdout: 'uv 0.2.0\n' }))
      }
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.2.0' })
    expect(mock$).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.2.0 already installed.'
    })
  })

  it('handles version detection with different output formats', async () => {
    setPlatform('linux')

    mock$.mockImplementation(() => {
      return {
        nothrow: () =>
          Promise.resolve(
            makeProcessOutput({ stdout: 'uv 1.0.0-beta.1 (abc123)\n' })
          )
      }
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '1.0.0-beta.1' })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 1.0.0-beta.1 already installed.'
    })
  })

  it('proceeds with installation when version detection fails due to invalid output', async () => {
    setPlatform('linux')

    const outputs = [
      {
        type: 'detect',
        result: makeProcessOutput({ stdout: 'invalid output\n' })
      },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ stdout: 'uv 1.0.0\n' }) }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.resolve(next.result)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '1.0.0' })
  })

  it('runs the install command when uv is missing on macOS/Linux', async () => {
    setPlatform('darwin')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ stdout: 'uv 0.3.1\n' }) }
    ]

    mock$.mockImplementation((...args) => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      // Verify the install command is correct for Unix systems
      // For template literals, the command is the second argument
      expect(args[1]).toContain(
        'curl -LsSf https://astral.sh/uv/install.sh | sh'
      )
      return Promise.resolve(next.result)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.3.1' })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.3.1 installed successfully.'
    })
  })

  it('runs the install command when uv is missing on Windows', async () => {
    setPlatform('win32')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ stdout: 'uv 0.4.0\n' }) }
    ]

    mock$.mockImplementation((...args) => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      // Verify the install command is correct for Windows
      // For template literals, the command is the second argument
      expect(args[1]).toContain(
        'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"'
      )
      return Promise.resolve(next.result)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.4.0' })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.4.0 installed successfully.'
    })
  })

  it('surfaces install guidance when installation fails on Windows', async () => {
    setPlatform('win32')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', error: new Error('Install failed') }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.reject(next.error)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    await expect(installUv({ emit })).rejects.toThrow('Install failed')

    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenLastCalledWith({
      level: BackendStatusLevel.Error,
      message: 'uv installation failed. Run the command manually.',
      commands: [
        {
          label: 'Install with PowerShell',
          command:
            'powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"'
        }
      ]
    })
  })

  it('surfaces install guidance when installation fails on Linux', async () => {
    setPlatform('linux')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', error: new Error('Network error') }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.reject(next.error)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    await expect(installUv({ emit })).rejects.toThrow('Network error')

    expect(emit).toHaveBeenLastCalledWith({
      level: BackendStatusLevel.Error,
      message: 'uv installation failed. Run the command manually.',
      commands: [
        {
          label: 'Install with shell script',
          command: 'curl -LsSf https://astral.sh/uv/install.sh | sh'
        }
      ]
    })
  })

  it('handles installation success but version detection failure', async () => {
    setPlatform('linux')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.resolve(next.result)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    await expect(installUv({ emit })).rejects.toThrow(
      'uv installation completed but could not verify version.'
    )

    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'Installing uv…'
    })
    expect(emit).toHaveBeenLastCalledWith({
      level: BackendStatusLevel.Error,
      message: 'uv installation finished but version could not be detected.'
    })
  })

  it('handles non-Error exceptions during installation', async () => {
    setPlatform('linux')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', error: 'String error' }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.reject(next.error)
    })

    const emit = vi.fn()
    const installUv = await getInstallUv()

    await expect(installUv({ emit })).rejects.toThrow(
      'Failed to install uv via provided command.'
    )

    expect(emit).toHaveBeenLastCalledWith({
      level: BackendStatusLevel.Error,
      message: 'uv installation failed. Run the command manually.',
      commands: [
        {
          label: 'Install with shell script',
          command: 'curl -LsSf https://astral.sh/uv/install.sh | sh'
        }
      ]
    })
  })

  it('handles version detection with no stdout match', async () => {
    setPlatform('linux')

    mock$.mockImplementation(() => {
      return {
        nothrow: () =>
          Promise.resolve(makeProcessOutput({ stdout: 'no version info\n' }))
      }
    })

    const emit = vi.fn()

    // The function should still try to proceed with installation
    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ stdout: 'uv 1.0.0\n' }) }
    ]

    mock$.mockImplementation(() => {
      const next = outputs.shift()

      if (!next) {
        throw new Error('Unexpected extra command')
      }

      if (next.type === 'detect') {
        return {
          nothrow: () => Promise.resolve(next.result)
        }
      }

      return Promise.resolve(next.result)
    })

    const installUv = await getInstallUv()
    const result = await installUv({ emit })

    expect(result).toEqual({ version: '1.0.0' })
  })
})

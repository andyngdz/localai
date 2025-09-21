import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import type { installUv as installUvType } from '../install-uv'
import { BackendStatusLevel } from '../types'

const mock$ = vi.fn()

vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

const makeProcessOutput = (
  overrides: Partial<{ exitCode: number; stdout: string; stderr: string }>
) => ({
  exitCode: 0,
  stdout: '',
  stderr: '',
  ...overrides
})

let installUv: typeof installUvType
const originalPlatform = process.platform

const setPlatform = (platform: NodeJS.Platform) => {
  Object.defineProperty(process, 'platform', {
    value: platform,
    configurable: true
  })
}

beforeAll(async () => {
  ;({ installUv: installUv } = await import('../install-uv'))
})

beforeEach(() => {
  mock$.mockReset()
  setPlatform(originalPlatform)
})

afterEach(() => {
  mock$.mockReset()
  setPlatform(originalPlatform)
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

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.2.0' })
    expect(mock$).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.2.0 already installed.'
    })
  })

  it('runs the install command when uv is missing on macOS/Linux', async () => {
    setPlatform('darwin')

    const outputs = [
      { type: 'detect', result: makeProcessOutput({ exitCode: 1 }) },
      { type: 'install', result: undefined },
      { type: 'detect', result: makeProcessOutput({ stdout: 'uv 0.3.1\n' }) }
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

    const result = await installUv({ emit })

    expect(result).toEqual({ version: '0.3.1' })
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'uv 0.3.1 installed successfully.'
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

    await expect(installUv({ emit })).rejects.toThrow('Install failed')

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
})

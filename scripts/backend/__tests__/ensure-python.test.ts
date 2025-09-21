import {
  describe,
  expect,
  it,
  afterEach,
  beforeAll,
  beforeEach,
  vi
} from 'vitest'
import type { ensurePython311 as ensurePython311Type } from '../ensure-python'
import { BackendStatusLevel } from '../types'

const mock$ = vi.fn()

vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

let ensurePython311: typeof ensurePython311Type

beforeAll(async () => {
  ;({ ensurePython311 } = await import('../ensure-python'))
})

const originalPlatform = process.platform

const setPlatform = (platform: NodeJS.Platform) => {
  Object.defineProperty(process, 'platform', {
    value: platform,
    configurable: true
  })
}

const createOutput = (
  overrides: Partial<{ exitCode: number; stdout: string }>
) => ({
  exitCode: 0,
  stdout: '',
  stderr: '',
  ...overrides
})

beforeEach(() => {
  mock$.mockReset()
  setPlatform(originalPlatform)
})

afterEach(() => {
  mock$.mockReset()
  setPlatform(originalPlatform)
})

describe('ensurePython311', () => {
  it('resolves when Python 3.11 is detected', async () => {
    setPlatform('linux')

    const outputs = [createOutput({ stdout: 'Python 3.11.5\n' })]

    mock$.mockImplementation(() => ({
      nothrow: () =>
        Promise.resolve(outputs.shift() ?? createOutput({ exitCode: 1 }))
    }))

    const emit = vi.fn()

    const result = await ensurePython311({ emit })

    expect(result).toEqual({
      command: 'python3.11',
      args: [],
      version: '3.11.5'
    })
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Info,
      message: 'Python 3.11.5 detected.'
    })
  })

  it('continues checking candidates until a 3.11 interpreter is found', async () => {
    setPlatform('linux')

    const outputs = [
      createOutput({ stdout: 'Python 3.10.12\n' }),
      createOutput({ stdout: 'Python 3.11.1\n' })
    ]

    mock$.mockImplementation(() => ({
      nothrow: () =>
        Promise.resolve(outputs.shift() ?? createOutput({ exitCode: 1 }))
    }))

    const emit = vi.fn()

    const result = await ensurePython311({ emit })

    expect(result).toEqual({ command: 'python3', args: [], version: '3.11.1' })
    expect(mock$).toHaveBeenCalledTimes(2)
  })

  it('emits install guidance with commands when Python is missing on Linux', async () => {
    setPlatform('linux')

    mock$.mockImplementation(() => ({
      nothrow: () => Promise.resolve(createOutput({ exitCode: 1 }))
    }))

    const emit = vi.fn()

    await expect(ensurePython311({ emit })).rejects.toThrow(
      'Python 3.11 is not installed.'
    )

    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Error,
      message:
        'Python 3.11 is required. Install it with your system package manager.',
      commands: [
        { label: 'Update packages', command: 'sudo apt update' },
        { label: 'Install Python 3.11', command: 'sudo apt install python3.11' }
      ]
    })
  })

  it('emits install options for Windows', async () => {
    setPlatform('win32')

    mock$.mockImplementation(() => ({
      nothrow: () => Promise.resolve(createOutput({ exitCode: 1 }))
    }))

    const emit = vi.fn()

    await expect(ensurePython311({ emit })).rejects.toThrow(
      'Python 3.11 is not installed.'
    )

    expect(emit).toHaveBeenCalledWith({
      level: BackendStatusLevel.Error,
      message:
        'Python 3.11 is required. Install it using winget, Chocolatey, or from python.org.',
      commands: [
        {
          label: 'Install with winget',
          command:
            'winget install Python.Python.3.11 --exact --silent --accept-package-agreements --accept-source-agreements'
        },
        {
          label: 'Install with Chocolatey',
          command: 'choco install python --version=3.11.9 -y'
        }
      ]
    })
  })
})

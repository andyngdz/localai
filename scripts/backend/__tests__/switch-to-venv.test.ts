import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { BackendStatusLevel } from '../types'
import { switchToVenv } from '../switch-to-venv'

type CommandRecorder = (
  pieces: TemplateStringsArray,
  ...args: unknown[]
) => Promise<void>

const { mock$, mockDollar, platformState } = vi.hoisted(() => {
  const innerMock$ = vi.fn<CommandRecorder>()
  const innerDollar: CommandRecorder & { cwd: string } = Object.assign(
    (pieces: TemplateStringsArray, ...args: unknown[]) =>
      innerMock$(pieces, ...args),
    { cwd: '' }
  )

  const state = { isWindows: false }

  return { mock$: innerMock$, mockDollar: innerDollar, platformState: state }
})

vi.mock('zx', () => ({
  $: mockDollar
}))

vi.mock('../utils', () => ({
  get isWindows() {
    return platformState.isWindows
  },
  normalizeError: (error: unknown, message: string) =>
    error instanceof Error ? error : new Error(message)
}))

describe('switchToVenv', () => {
  const originalCwd = '/original'
  let recordedCommands: string[]
  let cwdSnapshots: string[]
  let emit = vi.fn()

  beforeEach(() => {
    recordedCommands = []
    cwdSnapshots = []
    emit = vi.fn()
    platformState.isWindows = false
    mockDollar.cwd = originalCwd

    mock$.mockImplementation(
      (pieces: TemplateStringsArray, ...args: unknown[]) => {
        const command = pieces.reduce((acc, part, index) => {
          const interpolation = index < args.length ? String(args[index]) : ''
          return acc + part + interpolation
        }, '')
        recordedCommands.push(command.trim())
        cwdSnapshots.push(mockDollar.cwd)
        return Promise.resolve()
      }
    )
  })

  afterEach(() => {
    mock$.mockReset()
    mockDollar.cwd = originalCwd
  })

  it('activates the virtual environment on Unix-like systems', async () => {
    await switchToVenv({ backendPath: '/tmp/backend', emit })

    expect(mockDollar.cwd).toBe('/tmp/backend')
    expect(recordedCommands).toStrictEqual([
      'bash -c source .venv/bin/activate'
    ])
    expect(cwdSnapshots).toStrictEqual(['/tmp/backend'])

    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Switching to virtual environment'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Info,
      message: 'Virtual environment activated successfully'
    })
  })

  it('activates the virtual environment on Windows systems', async () => {
    platformState.isWindows = true

    await switchToVenv({ backendPath: 'C:/backend', emit })

    expect(mockDollar.cwd).toBe('C:/backend')
    expect(recordedCommands).toStrictEqual([
      'powershell -NoProfile -ExecutionPolicy ByPass -Command ". .venv\\Scripts\\Activate.ps1"'
    ])
    expect(cwdSnapshots).toStrictEqual(['C:/backend'])

    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Switching to virtual environment'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Info,
      message: 'Virtual environment activated successfully'
    })
  })

  it('reports an error when activation fails and surfaces manual command', async () => {
    platformState.isWindows = false
    mock$.mockImplementationOnce(
      (pieces: TemplateStringsArray, ...args: unknown[]) => {
        const command = pieces.reduce((acc, part, index) => {
          const interpolation = index < args.length ? String(args[index]) : ''
          return acc + part + interpolation
        }, '')
        recordedCommands.push(command.trim())
        cwdSnapshots.push(mockDollar.cwd)
        return Promise.reject(new Error('activation failed'))
      }
    )

    await expect(
      switchToVenv({ backendPath: '/tmp/backend', emit })
    ).rejects.toThrow('activation failed')

    expect(emit).toHaveBeenNthCalledWith(1, {
      level: BackendStatusLevel.Info,
      message: 'Switching to virtual environment'
    })
    expect(emit).toHaveBeenNthCalledWith(2, {
      level: BackendStatusLevel.Error,
      message:
        'Failed to activate virtual environment. Run the command manually.',
      commands: [
        {
          label: 'Activate virtual environment manually',
          command: 'source .venv/bin/activate'
        }
      ]
    })

    expect(mockDollar.cwd).toBe('/tmp/backend')
    expect(recordedCommands).toStrictEqual([
      'bash -c source .venv/bin/activate'
    ])
  })
})

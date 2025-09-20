import { $ } from 'zx'
import { BackendStatusEmitter, BackendStatusLevel, Command } from './types'

interface PythonCandidate {
  command: string
  baseArgs: string[]
}

interface EnsurePythonOptions {
  emit: BackendStatusEmitter
}

interface MissingInstruction {
  message: string
  commands: Command[]
}

const versionRegex = /Python\s+(\d+)\.(\d+)(?:\.(\d+))?/i

const pythonCandidates = (): PythonCandidate[] => {
  if (process.platform === 'win32') {
    return [
      { command: 'py', baseArgs: ['-3.11'] },
      { command: 'python3.11', baseArgs: [] },
      { command: 'python3', baseArgs: [] },
      { command: 'python', baseArgs: [] },
      { command: 'py', baseArgs: ['-3'] }
    ]
  }

  return [
    { command: 'python3.11', baseArgs: [] },
    { command: 'python3', baseArgs: [] },
    { command: 'python', baseArgs: [] }
  ]
}

const parseVersion = (output: string) => {
  const match = output.match(versionRegex)

  if (!match) {
    return
  }

  return `${match[1]}.${match[2]}.${match[3] ?? '0'}`
}

const tryCandidate = async (candidate: PythonCandidate) => {
  const args = [...candidate.baseArgs, '--version']
  const result = await $`${candidate.command} ${args}`.nothrow()

  if (result.exitCode !== 0) {
    return
  }

  const versionOutput = `${result.stdout} ${result.stderr}`.trim()
  const version = parseVersion(versionOutput)

  if (version && version.startsWith('3.11')) {
    return {
      command: candidate.command,
      args: candidate.baseArgs,
      version
    }
  }
}

const findPython = async () => {
  for (const candidate of pythonCandidates()) {
    const detected = await tryCandidate(candidate)

    if (detected) {
      return detected
    }
  }
}

const missingInstructions = (): MissingInstruction => {
  if (process.platform === 'darwin') {
    return {
      message:
        'Python 3.11 is required. Install it via Homebrew or download it from python.org.',
      commands: [
        {
          label: 'Install with Homebrew',
          command: 'brew install python@3.11'
        }
      ]
    }
  }

  if (process.platform === 'win32') {
    return {
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
    }
  }

  return {
    message:
      'Python 3.11 is required. Install it with your system package manager.',
    commands: [
      {
        label: 'Update packages',
        command: 'sudo apt update'
      },
      {
        label: 'Install Python 3.11',
        command: 'sudo apt install python3.11'
      }
    ]
  }
}

export const ensurePython311 = async ({ emit }: EnsurePythonOptions) => {
  const existing = await findPython()

  if (existing) {
    emit({
      level: BackendStatusLevel.Info,
      message: `Python ${existing.version} detected.`
    })

    return existing
  }

  const { message, commands } = missingInstructions()

  emit({
    level: BackendStatusLevel.Error,
    message,
    commands
  })

  throw new Error('Python 3.11 is not installed.')
}

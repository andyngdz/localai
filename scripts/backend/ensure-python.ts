import type { ProcessOutput } from 'zx'
import { $ } from 'zx'
import { BackendStatusEmitter, BackendStatusLevel } from './status'

$.quiet = true

interface PythonCandidate {
  command: string
  baseArgs: string[]
}

interface PythonInfo {
  command: string
  args: string[]
  version: string
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
  const result =
    (await $`${candidate.command} ${args}`.nothrow()) as ProcessOutput

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

const missingInstructions = () => {
  if (process.platform === 'darwin') {
    return 'Python 3.11 is required. Install it via Homebrew (brew install python@3.11) or download it from https://www.python.org/downloads/macos/.'
  }

  if (process.platform === 'win32') {
    return 'Python 3.11 is required. Install it from the Microsoft Store, winget (winget install Python.Python.3.11), or https://www.python.org/downloads/windows/.'
  }

  return 'Python 3.11 is required. Install it with your package manager, for example: sudo apt install python3.11.'
}

export interface EnsurePythonOptions {
  emit: BackendStatusEmitter
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

  const instructions = missingInstructions()

  emit({
    level: BackendStatusLevel.Error,
    message: instructions
  })

  throw new Error('Python 3.11 is not installed.')
}

import {
  BackendStatusCommand,
  BackendStatusEmitter,
  BackendStatusLevel
} from '@types'
import * as path from 'node:path'
import { $ } from 'zx'
import { BACKEND_DIRNAME } from './constants'
import { ensurePathIncludes, normalizeError, pathExists } from './utils'

export interface SetupVenvOptions {
  userDataPath: string
  emit: BackendStatusEmitter
}

export interface VenvInfo {
  venvPath: string
  backendPath: string
}

const setupVenv = async ({
  userDataPath,
  emit
}: SetupVenvOptions): Promise<VenvInfo> => {
  const backendPath = path.join(userDataPath, BACKEND_DIRNAME)
  const venvPath = path.join(backendPath, '.venv')
  $.cwd = backendPath

  // Check if backend directory exists
  const backendExists = await pathExists(backendPath)
  if (!backendExists) {
    emit({
      level: BackendStatusLevel.Error,
      message: 'Backend directory not found. Clone the backend first.'
    })
    throw new Error('Backend directory not found')
  }

  // Check if virtual environment already exists
  const venvExists = await pathExists(venvPath)
  if (venvExists) {
    emit({
      level: BackendStatusLevel.Info,
      message: 'Virtual environment already exists'
    })
    return { venvPath, backendPath }
  }

  const candidatePaths: string[] = []

  if (process.env.HOME) {
    candidatePaths.push(path.join(process.env.HOME, '.local', 'bin'))
  }

  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    candidatePaths.push(path.join(process.env.LOCALAPPDATA, 'uv', 'bin'))
  }

  ensurePathIncludes(candidatePaths)

  emit({
    level: BackendStatusLevel.Info,
    message: 'Creating virtual environment with Python 3.11…'
  })

  const uvCheck = await $`uv --version`.nothrow()
  const commands: BackendStatusCommand[] = []

  if (uvCheck.exitCode === 0) {
    const createVenvCommand = `uv venv .venv --python 3.11`
    commands.push({
      label: 'Create virtual environment manually (uv)',
      command: createVenvCommand
    })

    try {
      await $`uv venv .venv --python 3.11`

      emit({
        level: BackendStatusLevel.Info,
        message: 'Virtual environment created successfully'
      })

      return { venvPath, backendPath }
    } catch (error) {
      emit({
        level: BackendStatusLevel.Error,
        message:
          'Failed to create virtual environment with uv. Run the command manually.',
        commands
      })

      throw normalizeError(
        error,
        'Failed to create virtual environment with uv'
      )
    }
  }

  emit({
    level: BackendStatusLevel.Info,
    message: 'uv not found. Falling back to python -m venv'
  })

  const fallbackCommand = `python3 -m venv .venv`
  commands.push({
    label: 'Create virtual environment manually (python -m venv)',
    command: fallbackCommand
  })

  try {
    await $`python3 -m venv .venv`

    emit({
      level: BackendStatusLevel.Info,
      message: 'Virtual environment created successfully'
    })

    return { venvPath, backendPath }
  } catch (error) {
    emit({
      level: BackendStatusLevel.Error,
      message:
        'Failed to create virtual environment. Run one of the commands manually.',
      commands
    })

    throw normalizeError(error, 'Failed to create virtual environment')
  }
}

export { setupVenv }

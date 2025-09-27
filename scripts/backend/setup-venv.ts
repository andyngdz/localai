import * as path from 'path'
import { $ } from 'zx'
import { BACKEND_DIRNAME } from './constants'
import { BackendStatusEmitter, BackendStatusLevel, Command } from './types'
import { normalizeError, pathExists } from './utils'

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

  emit({
    level: BackendStatusLevel.Info,
    message: 'Creating virtual environment with Python 3.11…'
  })

  const createVenvCommand = `uv venv .venv --python 3.11`
  const commands: Command[] = [
    {
      label: 'Create virtual environment manually',
      command: createVenvCommand
    }
  ]

  try {
    // Use uv to create virtual environment with Python 3.11
    await $`${createVenvCommand}`

    emit({
      level: BackendStatusLevel.Info,
      message: 'Virtual environment created successfully'
    })

    return { venvPath, backendPath }
  } catch (error) {
    emit({
      level: BackendStatusLevel.Error,
      message:
        'Failed to create virtual environment. Run the command manually.',
      commands
    })

    throw normalizeError(error, 'Failed to create virtual environment')
  }
}

export { setupVenv }

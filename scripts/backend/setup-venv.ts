import { $ } from 'zx'
import path from 'path'
import { BACKEND_DIRNAME } from './constants'
import { BackendStatusEmitter, BackendStatusLevel, Command } from './types'
import { pathExists, normalizeError } from './utils'

export interface SetupVenvOptions {
  userDataPath: string
  emit: BackendStatusEmitter
}

export interface VenvInfo {
  venvPath: string
  backendPath: string
}

export const setupVenv = async ({
  userDataPath,
  emit
}: SetupVenvOptions): Promise<VenvInfo> => {
  const backendPath = path.join(userDataPath, BACKEND_DIRNAME)
  const venvPath = path.join(backendPath, '.venv')

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

  const commands: Command[] = [
    {
      label: 'Create virtual environment manually',
      command: `cd ${backendPath} && uv venv .venv --python 3.11`
    }
  ]

  try {
    // Use uv to create virtual environment with Python 3.11
    await $`cd ${backendPath} && uv venv .venv --python 3.11`

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

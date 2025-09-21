import { $ } from 'zx'
import path from 'path'
import { BackendStatusEmitter, BackendStatusLevel, Command } from './types'
import { pathExists, normalizeError } from './utils'

export interface InstallDependenciesOptions {
  backendPath: string
  venvPath: string
  emit: BackendStatusEmitter
}

export const installDependencies = async ({
  backendPath,
  venvPath,
  emit
}: InstallDependenciesOptions): Promise<void> => {
  const requirementsPath = path.join(backendPath, 'requirements.txt')
  const requirementsExists = await pathExists(requirementsPath)

  if (!requirementsExists) {
    emit({
      level: BackendStatusLevel.Error,
      message: 'requirements.txt not found in backend directory'
    })
    throw new Error('requirements.txt not found')
  }

  emit({
    level: BackendStatusLevel.Info,
    message: 'Installing Python dependencies…'
  })

  const commands: Command[] = [
    {
      label: 'Install dependencies manually',
      command: `cd ${backendPath} && uv pip install -r requirements.txt`
    }
  ]

  try {
    // Use uv to install dependencies in the virtual environment
    await $`cd ${backendPath} && uv pip install -r requirements.txt`

    emit({
      level: BackendStatusLevel.Info,
      message: 'Dependencies installed successfully'
    })
  } catch (error) {
    emit({
      level: BackendStatusLevel.Error,
      message: 'Failed to install dependencies. Run the command manually.',
      commands
    })

    throw normalizeError(error, 'Failed to install dependencies')
  }
}

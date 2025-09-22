import { $ } from 'zx'
import { BackendStatusEmitter, BackendStatusLevel, Command } from './types'
import { normalizeError } from './utils'

export interface InstallDependenciesOptions {
  backendPath: string
  emit: BackendStatusEmitter
}

export const installDependencies = async ({
  backendPath,
  emit
}: InstallDependenciesOptions): Promise<void> => {
  $.cwd = backendPath

  emit({
    level: BackendStatusLevel.Info,
    message: 'Installing Python dependencies…'
  })

  try {
    await $`uv pip install -r requirements.txt`

    emit({
      level: BackendStatusLevel.Info,
      message: 'Dependencies installed successfully'
    })
  } catch (error) {
    const installCommand = `uv pip install -r requirements.txt`
    const commands: Command[] = [
      {
        label: 'Install dependencies manually',
        command: installCommand
      }
    ]

    emit({
      level: BackendStatusLevel.Error,
      message: 'Failed to install dependencies. Run the command manually.',
      commands
    })

    throw normalizeError(error, 'Failed to install dependencies')
  }
}

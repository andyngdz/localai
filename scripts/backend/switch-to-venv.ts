import { $ } from 'zx'
import { BackendStatusEmitter, BackendStatusLevel } from './types'
import { isWindows, normalizeError } from './utils'

export interface SwitchToVenvOptions {
  backendPath: string
  emit: BackendStatusEmitter
}

export interface VenvActivationInfo {
  venvPath: string
  activationScript: string
  isWindows: boolean
}

export const switchToVenv = async ({
  backendPath,
  emit
}: SwitchToVenvOptions) => {
  $.cwd = backendPath

  emit({
    level: BackendStatusLevel.Info,
    message: `Switching to virtual environment`
  })

  const windowsCommand = 'call .venv\\Scripts\\Activate.ps1'
  const unixCommand = 'source .venv/bin/activate'
  const switchCommand = isWindows ? windowsCommand : unixCommand

  try {
    if (isWindows) {
      await $`${windowsCommand}`
    } else {
      await $`bash -c ${unixCommand}`
    }

    emit({
      level: BackendStatusLevel.Info,
      message: 'Virtual environment activated successfully'
    })
  } catch (error) {
    emit({
      level: BackendStatusLevel.Error,
      message:
        'Failed to activate virtual environment. Run the command manually.',
      commands: [
        {
          label: 'Activate virtual environment manually',
          command: switchCommand
        }
      ]
    })

    throw normalizeError(error, 'Failed to activate virtual environment')
  }
}

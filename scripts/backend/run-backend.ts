import { $ } from 'zx'
import * as path from 'path'
import { BackendStatusEmitter, BackendStatusLevel } from './types'
import { pathExists, normalizeError } from './utils'

export interface RunBackendOptions {
  backendPath: string
  emit: BackendStatusEmitter
}

export const runBackend = async ({
  backendPath,
  emit
}: RunBackendOptions): Promise<void> => {
  // Check if main.py exists
  const mainPyPath = path.join(backendPath, 'main.py')
  const mainExists = await pathExists(mainPyPath)

  if (!mainExists) {
    emit({
      level: BackendStatusLevel.Error,
      message:
        'main.py not found in backend directory. Try restarting the application.'
    })
    throw new Error('main.py not found')
  }

  emit({
    level: BackendStatusLevel.Info,
    message: 'Starting LocalAI Backend…'
  })

  try {
    // Run uvicorn with the LocalAI Backend app
    await $`cd ${backendPath} && uvicorn main:app`

    emit({
      level: BackendStatusLevel.Info,
      message: 'LocalAI Backend started successfully'
    })
  } catch (error) {
    emit({
      level: BackendStatusLevel.Error,
      message:
        'Failed to start LocalAI Backend. Please restart the application.'
    })

    throw normalizeError(error, 'Failed to start LocalAI Backend')
  }
}

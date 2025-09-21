import { cloneBackend } from './clone-backend'
import { ensurePython311 } from './ensure-python'
import { installDependencies } from './install-dependencies'
import { installUv } from './install-uv'
import { runBackend } from './run-backend'
import { setupVenv } from './setup-venv'
import { BackendStatusLevel } from './types'
import { createDefaultStatusEmitter, normalizeError } from './utils'

export interface StartBackendOptions {
  userDataPath: string
}

export const startBackend = async ({ userDataPath }: StartBackendOptions) => {
  const emit = createDefaultStatusEmitter()

  try {
    // Step 1: Ensure Python 3.11 is installed
    await ensurePython311({ emit })

    // Step 2: Install uv (Python package manager)
    await installUv({ emit })

    // Step 3: Clone the backend repository
    const { backendPath } = await cloneBackend({ userDataPath, emit })

    // Step 4: Create virtual environment with uv and Python 3.11
    const { venvPath } = await setupVenv({ userDataPath, emit })

    // Step 5: Install dependencies using uv
    await installDependencies({ backendPath, venvPath, emit })

    // Step 6: Run the LocalAI Backend with uvicorn
    await runBackend({ backendPath, emit })
  } catch (error) {
    const normalizedError = normalizeError(error, 'Unknown error')

    emit({
      level: BackendStatusLevel.Error,
      message: `Backend setup failed: ${normalizedError.message}`
    })
  }
}

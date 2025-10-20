import { BackendStatusEmitter, BackendStatusLevel, Nullable } from '@types'
import * as path from 'node:path'
import { $, type ProcessPromise } from 'zx'
import { findAvailablePort, normalizeError, pathExists } from './utils'

export interface RunBackendOptions {
  backendPath: string
  emit: BackendStatusEmitter
}

// Store the backend process reference for cleanup
let backendProcess: Nullable<ProcessPromise>
// Store the actual port being used (defaults to 8000)
let backendPort = 8000

const onLogOutput = (data: Buffer | string) => {
  const output = data.toString().trim()

  if (output) {
    if (output.includes('ERROR')) {
      console.error(output)
    } else {
      console.info(output)
    }
  }
}

const runBackend = async ({ backendPath, emit }: RunBackendOptions) => {
  // Stop any existing backend process before starting a new one
  if (backendProcess) {
    stopBackend()
  }

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
    message: 'Finding available port for backend…'
  })

  try {
    // Find an available port (tries 8000 first, then increments)
    const port = await findAvailablePort(8000)
    backendPort = port

    emit({
      level: BackendStatusLevel.Info,
      message: `Starting LocalAI Backend on port ${port}…`
    })

    emit({
      level: BackendStatusLevel.Info,
      message: 'LocalAI Backend started successfully'
    })

    // Configure zx to stream output and run uvicorn
    // This will run uvicorn and stream its output to console.log
    // which will then be captured by the log streamer
    process.chdir(backendPath)

    // Run uvicorn with the dynamically allocated port
    backendProcess = $`uvicorn main:app --host 127.0.0.1 --port ${port}`

    // Stream the output to console so it gets picked up by log streaming
    backendProcess.stdout.on('data', onLogOutput)

    backendProcess.stderr.on('data', onLogOutput)

    // Don't await - let it run in background
    backendProcess.catch((error) => {
      emit({
        level: BackendStatusLevel.Error,
        message: 'Backend process failed. Please restart the application.'
      })

      throw normalizeError(error, 'Backend process failed')
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

const stopBackend = () => {
  if (backendProcess) {
    try {
      backendProcess.kill()
      backendPort = 8000
    } catch (error) {
      console.error('Failed to stop backend process:', error)
    }
  }
}

const getBackendPort = () => backendPort

export { getBackendPort, runBackend, stopBackend }

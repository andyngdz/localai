import { BackendStatusEmitter, BackendStatusLevel } from '@types'
import * as path from 'node:path'
import { $, type ProcessPromise } from 'zx'
import { normalizeError, pathExists } from './utils'

export interface RunBackendOptions {
  backendPath: string
  emit: BackendStatusEmitter
}

// Store the backend process reference for cleanup
let backendProcess: ProcessPromise | null = null

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

const runBackend = async ({
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
    emit({
      level: BackendStatusLevel.Info,
      message: 'LocalAI Backend started successfully'
    })

    // Configure zx to stream output and run uvicorn
    // This will run uvicorn and stream its output to console.log
    // which will then be captured by the log streamer
    process.chdir(backendPath)

    // Run uvicorn in a way that streams output to console
    backendProcess = $`uvicorn main:app`

    // Stream the output to console so it gets picked up by log streaming
    backendProcess.stdout.on('data', onLogOutput)

    backendProcess.stderr.on('data', onLogOutput)

    // Don't await - let it run in background
    backendProcess.catch((error) => {
      emit({
        level: BackendStatusLevel.Error,
        message: `Backend process failed: ${error.message}`
      })
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
      backendProcess = null
    } catch (error) {
      console.error('Failed to stop backend process:', error)
    }
  }
}

export { runBackend, stopBackend }

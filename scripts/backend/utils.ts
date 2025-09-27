import * as fs from 'fs/promises'
import { BackendStatusEmitter, BackendStatusLevel } from './types'

const isWindows = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

/**
 * Checks if a file or directory exists at the given path
 * @param targetPath - The path to check
 * @returns Promise<boolean> - true if path exists, false otherwise
 */
const pathExists = async (targetPath: string): Promise<boolean> => {
  try {
    await fs.access(targetPath)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false
    }

    throw error
  }
}

/**
 * Normalizes an error to ensure it's an Error instance
 * @param error - The error to normalize
 * @param defaultMessage - Default message if error is not an Error instance
 * @returns Error instance
 */
const normalizeError = (error: unknown, defaultMessage: string): Error => {
  return error instanceof Error ? error : new Error(defaultMessage)
}

/**
 * Creates a default status emitter that logs to console
 * @returns BackendStatusEmitter function
 */
const createDefaultStatusEmitter = (): BackendStatusEmitter => (payload) => {
  const prefix =
    payload.level === BackendStatusLevel.Error
      ? '[Backend Setup][Error]'
      : '[Backend Setup][Info]'

  console.log(`${prefix} ${payload.message}`)
}

export {
  createDefaultStatusEmitter,
  isLinux,
  isMac,
  isWindows,
  normalizeError,
  pathExists
}

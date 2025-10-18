import { BackendStatusEmitter, BackendStatusLevel } from '@types'
import { existsSync } from 'node:fs'
import * as fs from 'node:fs/promises'

const isWindows = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

const pathKeyName = () => {
  if (!isWindows) {
    return 'PATH'
  }

  const entries = Object.keys(process.env)
  const match = entries.find((key) => key.toLowerCase() === 'path')

  return match ?? 'PATH'
}

const ensurePathIncludes = (directories: string[]) => {
  if (!directories.length) {
    return
  }

  const separator = process.platform === 'win32' ? ';' : ':'
  const key = pathKeyName()
  const currentValue = process.env[key]
  const current = currentValue
    ? currentValue.split(separator).filter(Boolean)
    : []

  const additions = directories
    .filter(Boolean)
    .filter((directory) => existsSync(directory))
    .filter((directory) => !current.includes(directory))

  if (!additions.length) {
    return
  }

  const updated = [...additions, ...current]
  process.env[key] = updated.join(separator)
}

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
  ensurePathIncludes,
  isLinux,
  isMac,
  isWindows,
  normalizeError,
  pathExists
}

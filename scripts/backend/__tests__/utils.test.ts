import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as fs from 'fs/promises'
import {
  pathExists,
  normalizeError,
  createDefaultStatusEmitter
} from '../utils'
import { BackendStatusLevel } from '../types'

vi.mock('fs/promises')

const mockAccess = vi.mocked(fs.access)

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('pathExists', () => {
    it('should return true when path exists', async () => {
      mockAccess.mockResolvedValue()

      const result = await pathExists('/test/path')

      expect(result).toBe(true)
      expect(mockAccess).toHaveBeenCalledWith('/test/path')
    })

    it('should return false when path does not exist', async () => {
      const error = new Error('File not found') as NodeJS.ErrnoException
      error.code = 'ENOENT'
      mockAccess.mockRejectedValue(error)

      const result = await pathExists('/nonexistent/path')

      expect(result).toBe(false)
    })

    it('should throw error for non-ENOENT errors', async () => {
      const error = new Error('Permission denied') as NodeJS.ErrnoException
      error.code = 'EACCES'
      mockAccess.mockRejectedValue(error)

      await expect(pathExists('/test/path')).rejects.toThrow(
        'Permission denied'
      )
    })
  })

  describe('normalizeError', () => {
    it('should return Error instance unchanged', () => {
      const error = new Error('Test error')
      const result = normalizeError(error, 'Default message')

      expect(result).toBe(error)
      expect(result.message).toBe('Test error')
    })

    it('should convert non-Error to Error with default message', () => {
      const result = normalizeError('string error', 'Default message')

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Default message')
    })

    it('should handle null/undefined', () => {
      const result = normalizeError(null, 'Default message')

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Default message')
    })
  })

  describe('createDefaultStatusEmitter', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    beforeEach(() => {
      consoleSpy.mockClear()
    })

    it('should create emitter that logs info messages', () => {
      const emit = createDefaultStatusEmitter()

      emit({
        level: BackendStatusLevel.Info,
        message: 'Test info message'
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Backend Setup][Info] Test info message'
      )
    })

    it('should create emitter that logs error messages', () => {
      const emit = createDefaultStatusEmitter()

      emit({
        level: BackendStatusLevel.Error,
        message: 'Test error message'
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Backend Setup][Error] Test error message'
      )
    })
  })
})

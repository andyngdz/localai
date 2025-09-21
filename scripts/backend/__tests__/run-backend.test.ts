import path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { runBackend } from '../run-backend'
import { BackendStatusLevel } from '../types'
import * as utilsModule from '../utils'

// Mock dependencies
const mock$ = vi.fn()
vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))
vi.mock('../utils')

const mockPathExists = vi.mocked(utilsModule.pathExists)
const mockNormalizeError = vi.mocked(utilsModule.normalizeError)

describe('runBackend', () => {
  const mockBackendPath = '/test/backend'
  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mock$.mockReset()

    // Setup default successful mocks
    mockPathExists.mockResolvedValue(true)
    mock$.mockResolvedValue({})
    mockNormalizeError.mockImplementation((error, defaultMessage) =>
      error instanceof Error ? error : new Error(defaultMessage)
    )
  })

  describe('successful backend startup', () => {
    it('should start LocalAI Backend successfully when main.py exists', async () => {
      await runBackend({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      // Verify main.py existence check
      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(mockBackendPath, 'main.py')
      )

      // Verify status emissions
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Starting LocalAI Backend…'
      })

      // Verify uvicorn command execution
      expect(mock$).toHaveBeenCalledTimes(1)

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'LocalAI Backend started successfully'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should throw error when main.py does not exist', async () => {
      mockPathExists.mockResolvedValue(false)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('main.py not found')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'main.py not found in backend directory. Try restarting the application.'
      })

      // Should not attempt to start uvicorn
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should handle uvicorn startup failure', async () => {
      const startupError = new Error('uvicorn failed to start')
      mock$.mockRejectedValue(startupError)
      mockNormalizeError.mockReturnValue(startupError)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('uvicorn failed to start')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Starting LocalAI Backend…'
      })

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'Failed to start LocalAI Backend. Please restart the application.'
      })

      expect(mockNormalizeError).toHaveBeenCalledWith(
        startupError,
        'Failed to start LocalAI Backend'
      )
    })

    it('should handle pathExists errors', async () => {
      const pathError = new Error('File system error')
      mockPathExists.mockRejectedValue(pathError)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('File system error')

      // Should not emit any status messages
      expect(mockEmit).not.toHaveBeenCalled()
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should normalize non-Error objects thrown by uvicorn command', async () => {
      const stringError = 'String error message'
      const normalizedError = new Error('Failed to start LocalAI Backend')
      mock$.mockRejectedValue(stringError)
      mockNormalizeError.mockReturnValue(normalizedError)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Failed to start LocalAI Backend')

      expect(mockNormalizeError).toHaveBeenCalledWith(
        stringError,
        'Failed to start LocalAI Backend'
      )
    })
  })

  describe('command execution', () => {
    it('should use correct uvicorn command with backendPath', async () => {
      const customBackendPath = '/custom/path/to/backend'

      await runBackend({
        backendPath: customBackendPath,
        emit: mockEmit
      })

      // Verify main.py path check
      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(customBackendPath, 'main.py')
      )

      // Verify uvicorn command was called
      expect(mock$).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty backendPath', async () => {
      const emptyPath = ''

      await runBackend({
        backendPath: emptyPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(emptyPath, 'main.py')
      )

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle paths with spaces and special characters', async () => {
      const specialPath = '/path with spaces/special-chars_123'

      await runBackend({
        backendPath: specialPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(specialPath, 'main.py')
      )

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle relative paths correctly', async () => {
      const relativePath = './backend'

      await runBackend({
        backendPath: relativePath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(relativePath, 'main.py')
      )

      expect(mock$).toHaveBeenCalledTimes(1)
    })
  })

  describe('main.py path construction', () => {
    it('should construct correct main.py path with path.join', async () => {
      const backendPath = '/test/backend/path'

      await runBackend({
        backendPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(backendPath, 'main.py')
      )
    })

    it('should handle Windows-style paths', async () => {
      const windowsPath = 'C:\\Users\\test\\backend'

      await runBackend({
        backendPath: windowsPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(windowsPath, 'main.py')
      )
    })
  })

  describe('emit function calls', () => {
    it('should emit correct sequence of status messages for successful startup', async () => {
      await runBackend({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Starting LocalAI Backend…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Info,
        message: 'LocalAI Backend started successfully'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })

    it('should emit correct sequence for main.py not found error', async () => {
      mockPathExists.mockResolvedValue(false)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledTimes(1)
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'main.py not found in backend directory. Try restarting the application.'
      })
    })

    it('should emit correct sequence for uvicorn startup failure', async () => {
      mock$.mockRejectedValue(new Error('Command failed'))

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Starting LocalAI Backend…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Error,
        message:
          'Failed to start LocalAI Backend. Please restart the application.'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })

  describe('uvicorn command verification', () => {
    it('should verify uvicorn command execution', async () => {
      let commandExecuted = false
      mock$.mockImplementation(() => {
        commandExecuted = true
        return Promise.resolve({})
      })

      await runBackend({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      expect(commandExecuted).toBe(true)
      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle uvicorn command timeout or hanging', async () => {
      const timeoutError = new Error('Command timeout')
      mock$.mockRejectedValue(timeoutError)

      await expect(
        runBackend({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Command timeout')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'Failed to start LocalAI Backend. Please restart the application.'
      })
    })
  })

  describe('concurrent operations', () => {
    it('should handle multiple concurrent runBackend calls', async () => {
      const promises = [
        runBackend({ backendPath: '/path1', emit: mockEmit }),
        runBackend({ backendPath: '/path2', emit: mockEmit }),
        runBackend({ backendPath: '/path3', emit: mockEmit })
      ]

      await Promise.all(promises)

      // Each call should check for main.py
      expect(mockPathExists).toHaveBeenCalledTimes(3)
      // Each call should execute uvicorn
      expect(mock$).toHaveBeenCalledTimes(3)
      // Each call should emit 2 status messages (start + success)
      expect(mockEmit).toHaveBeenCalledTimes(6)
    })

    it('should handle mixed success and failure scenarios', async () => {
      mockPathExists
        .mockResolvedValueOnce(true) // First call succeeds
        .mockResolvedValueOnce(false) // Second call fails
        .mockResolvedValueOnce(true) // Third call succeeds

      const promises = [
        runBackend({ backendPath: '/path1', emit: mockEmit }),
        runBackend({ backendPath: '/path2', emit: mockEmit }).catch(() => {}), // Catch to prevent unhandled rejection
        runBackend({ backendPath: '/path3', emit: mockEmit })
      ]

      await Promise.all(promises)

      expect(mockPathExists).toHaveBeenCalledTimes(3)
      expect(mock$).toHaveBeenCalledTimes(2) // Only successful calls execute uvicorn
    })
  })
})

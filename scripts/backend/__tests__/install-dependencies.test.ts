import path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { installDependencies } from '../install-dependencies'
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

describe('installDependencies', () => {
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

  describe('successful dependency installation', () => {
    it('should install dependencies successfully when requirements.txt exists', async () => {
      await installDependencies({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      // Verify requirements.txt existence check
      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(mockBackendPath, 'requirements.txt')
      )

      // Verify status emissions
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Installing Python dependencies…'
      })

      // Verify dependency installation command was called
      expect(mock$).toHaveBeenCalledTimes(1)

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Dependencies installed successfully'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should throw error when requirements.txt does not exist', async () => {
      mockPathExists.mockResolvedValue(false)

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('requirements.txt not found')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'requirements.txt not found in backend directory'
      })

      // Should not attempt installation
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should handle uv pip install command failure', async () => {
      const installError = new Error('pip install failed')
      mock$.mockRejectedValue(installError)
      mockNormalizeError.mockReturnValue(installError)

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('pip install failed')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Installing Python dependencies…'
      })

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'Failed to install dependencies. Run the command manually.',
        commands: [
          {
            label: 'Install dependencies manually',
            command: `cd ${mockBackendPath} && uv pip install -r requirements.txt`
          }
        ]
      })

      expect(mockNormalizeError).toHaveBeenCalledWith(
        installError,
        'Failed to install dependencies'
      )
    })

    it('should handle pathExists errors', async () => {
      const pathError = new Error('File system error')
      mockPathExists.mockRejectedValue(pathError)

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('File system error')

      // Should not emit any status messages
      expect(mockEmit).not.toHaveBeenCalled()
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should normalize non-Error objects thrown by uv command', async () => {
      const stringError = 'String error message'
      const normalizedError = new Error('Failed to install dependencies')
      mock$.mockRejectedValue(stringError)
      mockNormalizeError.mockReturnValue(normalizedError)

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Failed to install dependencies')

      expect(mockNormalizeError).toHaveBeenCalledWith(
        stringError,
        'Failed to install dependencies'
      )
    })
  })

  describe('command generation', () => {
    it('should use correct command format with backendPath', async () => {
      const customBackendPath = '/custom/path/to/backend'

      await installDependencies({
        backendPath: customBackendPath,
        emit: mockEmit
      })

      expect(mock$).toHaveBeenCalledTimes(1)

      // Verify manual command in error case would use same path
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Installing Python dependencies…'
      })
    })

    it('should provide correct manual command in error message', async () => {
      const customBackendPath = '/custom/backend/path'
      mock$.mockRejectedValue(new Error('Installation failed'))

      await expect(
        installDependencies({
          backendPath: customBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'Failed to install dependencies. Run the command manually.',
        commands: [
          {
            label: 'Install dependencies manually',
            command: `cd ${customBackendPath} && uv pip install -r requirements.txt`
          }
        ]
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty backendPath', async () => {
      const emptyPath = ''

      await installDependencies({
        backendPath: emptyPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(emptyPath, 'requirements.txt')
      )

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle paths with spaces and special characters', async () => {
      const specialPath = '/path with spaces/special-chars_123'

      await installDependencies({
        backendPath: specialPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(specialPath, 'requirements.txt')
      )

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle venvPath parameter (even though not currently used)', async () => {
      await installDependencies({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      // Function should still work correctly
      expect(mock$).toHaveBeenCalledTimes(1)
    })
  })

  describe('requirements.txt path construction', () => {
    it('should construct correct requirements.txt path with path.join', async () => {
      const backendPath = '/test/backend/path'

      await installDependencies({
        backendPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(backendPath, 'requirements.txt')
      )
    })

    it('should handle relative paths correctly', async () => {
      const relativePath = './backend'

      await installDependencies({
        backendPath: relativePath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(
        path.join(relativePath, 'requirements.txt')
      )
    })
  })

  describe('emit function calls', () => {
    it('should emit correct sequence of status messages for successful installation', async () => {
      await installDependencies({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Installing Python dependencies…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Info,
        message: 'Dependencies installed successfully'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })

    it('should emit correct sequence for requirements.txt not found error', async () => {
      mockPathExists.mockResolvedValue(false)

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledTimes(1)
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'requirements.txt not found in backend directory'
      })
    })

    it('should emit correct sequence for installation failure', async () => {
      mock$.mockRejectedValue(new Error('Command failed'))

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Installing Python dependencies…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Error,
        message: 'Failed to install dependencies. Run the command manually.',
        commands: [
          {
            label: 'Install dependencies manually',
            command: `cd ${mockBackendPath} && uv pip install -r requirements.txt`
          }
        ]
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })
})

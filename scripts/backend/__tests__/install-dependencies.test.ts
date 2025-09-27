import { beforeEach, describe, expect, it, vi } from 'vitest'
import { installDependencies } from '../install-dependencies'
import { BackendStatusLevel } from '../types'
import * as utilsModule from '../utils'

// Mock dependencies
vi.mock('zx', () => ({
  $: vi.fn()
}))
vi.mock('../utils')

// Get references to mocked functions
import { $ } from 'zx'
const mock$ = vi.mocked($)
const mockNormalizeError = vi.mocked(utilsModule.normalizeError)

describe('installDependencies', () => {
  const mockBackendPath = '/test/backend'
  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mock$.mockReset()

    // Setup default successful mocks
    mock$.mockResolvedValue({})
    mockNormalizeError.mockImplementation((error, defaultMessage) =>
      error instanceof Error ? error : new Error(defaultMessage)
    )
  })

  describe('successful dependency installation', () => {
    it('should install dependencies successfully', async () => {
      await installDependencies({
        backendPath: mockBackendPath,
        emit: mockEmit
      })

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
            command: 'uv pip install -r requirements.txt'
          }
        ]
      })

      expect(mockNormalizeError).toHaveBeenCalledWith(
        installError,
        'Failed to install dependencies'
      )
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
    it('should run uv command', async () => {
      await installDependencies({
        backendPath: '/custom/path/to/backend',
        emit: mockEmit
      })

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should provide correct manual command in error message', async () => {
      mock$.mockRejectedValue(new Error('Installation failed'))

      await expect(
        installDependencies({
          backendPath: mockBackendPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'Failed to install dependencies. Run the command manually.',
        commands: [
          {
            label: 'Install dependencies manually',
            command: 'uv pip install -r requirements.txt'
          }
        ]
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty backendPath', async () => {
      await installDependencies({
        backendPath: '',
        emit: mockEmit
      })

      expect(mock$).toHaveBeenCalledTimes(1)
    })

    it('should handle paths with spaces and special characters', async () => {
      await installDependencies({
        backendPath: '/path with spaces/special-chars_123',
        emit: mockEmit
      })

      expect(mock$).toHaveBeenCalledTimes(1)
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
            command: 'uv pip install -r requirements.txt'
          }
        ]
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })
})

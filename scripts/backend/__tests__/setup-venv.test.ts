import { BackendStatusLevel } from '@types'
import * as path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BACKEND_DIRNAME } from '../constants'
import { setupVenv } from '../setup-venv'
import * as utilsModule from '../utils'

// Mock dependencies
const mock$ = vi.fn()
vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))
vi.mock('../utils')

const mockPathExists = vi.mocked(utilsModule.pathExists)
const mockNormalizeError = vi.mocked(utilsModule.normalizeError)

describe('setupVenv', () => {
  const mockUserDataPath = '/test/user/data'
  const expectedBackendPath = path.join(mockUserDataPath, BACKEND_DIRNAME)
  const expectedVenvPath = path.join(expectedBackendPath, '.venv')
  const mockEmit = vi.fn()

  const mockUvCheckSuccess = () =>
    mock$.mockReturnValueOnce({
      nothrow: () =>
        Promise.resolve({
          exitCode: 0,
          stdout: 'uv 0.0.0\n',
          stderr: ''
        })
    })

  const mockUvCheckFailure = () =>
    mock$.mockReturnValueOnce({
      nothrow: () =>
        Promise.resolve({
          exitCode: 1,
          stdout: '',
          stderr: ''
        })
    })

  beforeEach(() => {
    vi.clearAllMocks()
    mock$.mockReset()

    // Setup default successful mocks
    mockPathExists.mockImplementation((targetPath) => {
      // Backend directory exists, venv does not
      if (targetPath === expectedBackendPath) return Promise.resolve(true)
      if (targetPath === expectedVenvPath) return Promise.resolve(false)
      return Promise.resolve(false)
    })
    mockNormalizeError.mockImplementation((error, defaultMessage) =>
      error instanceof Error ? error : new Error(defaultMessage)
    )
  })

  describe('successful venv creation', () => {
    it('should create virtual environment successfully when backend exists and venv does not', async () => {
      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      // Verify backend directory existence check
      expect(mockPathExists).toHaveBeenCalledWith(expectedBackendPath)

      // Verify venv directory existence check
      expect(mockPathExists).toHaveBeenCalledWith(expectedVenvPath)

      // Verify status emissions
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Creating virtual environment with Python 3.11…'
      })

      // Verify uv detection and venv creation commands executed
      expect(mock$).toHaveBeenCalledTimes(2)

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Virtual environment created successfully'
      })

      // Verify return value
      expect(result).toEqual({
        venvPath: expectedVenvPath,
        backendPath: expectedBackendPath
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })

    it('should return existing venv when it already exists', async () => {
      mockPathExists.mockImplementation((targetPath) => {
        // Both backend and venv exist
        if (targetPath === expectedBackendPath) return Promise.resolve(true)
        if (targetPath === expectedVenvPath) return Promise.resolve(true)
        return Promise.resolve(false)
      })

      const result = await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      // Verify checks were performed
      expect(mockPathExists).toHaveBeenCalledWith(expectedBackendPath)
      expect(mockPathExists).toHaveBeenCalledWith(expectedVenvPath)

      // Should emit info about existing venv
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Virtual environment already exists'
      })

      // Should not attempt to create venv
      expect(mock$).not.toHaveBeenCalled()

      // Verify return value
      expect(result).toEqual({
        venvPath: expectedVenvPath,
        backendPath: expectedBackendPath
      })

      expect(mockEmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should throw error when backend directory does not exist', async () => {
      mockPathExists.mockImplementation((targetPath) => {
        // Backend directory does not exist
        if (targetPath === expectedBackendPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Backend directory not found')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'Backend directory not found. Clone the backend first.'
      })

      // Should not check for venv or attempt creation
      expect(mockPathExists).toHaveBeenCalledWith(expectedBackendPath)
      expect(mockPathExists).not.toHaveBeenCalledWith(expectedVenvPath)
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should handle uv venv command failure', async () => {
      const venvError = new Error('uv venv failed')
      mockUvCheckSuccess()
      mock$.mockRejectedValueOnce(venvError)
      mockNormalizeError.mockReturnValue(venvError)

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow('uv venv failed')

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Creating virtual environment with Python 3.11…'
      })

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'Failed to create virtual environment with uv. Run the command manually.',
        commands: [
          {
            label: 'Create virtual environment manually (uv)',
            command: `uv venv .venv --python 3.11`
          }
        ]
      })

      expect(mockNormalizeError).toHaveBeenCalledWith(
        venvError,
        'Failed to create virtual environment with uv'
      )
    })

    it('should handle pathExists errors for backend directory', async () => {
      const pathError = new Error('File system error')
      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === expectedBackendPath) return Promise.reject(pathError)
        return Promise.resolve(false)
      })

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow('File system error')

      // Should not emit any status messages
      expect(mockEmit).not.toHaveBeenCalled()
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should handle pathExists errors for venv directory', async () => {
      const pathError = new Error('Venv check failed')
      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === expectedBackendPath) return Promise.resolve(true)
        if (targetPath === expectedVenvPath) return Promise.reject(pathError)
        return Promise.resolve(false)
      })

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Venv check failed')

      expect(mockPathExists).toHaveBeenCalledWith(expectedBackendPath)
      expect(mockPathExists).toHaveBeenCalledWith(expectedVenvPath)
      expect(mockEmit).not.toHaveBeenCalled()
      expect(mock$).not.toHaveBeenCalled()
    })

    it('should normalize non-Error objects thrown by uv command', async () => {
      const stringError = 'String error message'
      const normalizedError = new Error('Failed to create virtual environment')
      mockUvCheckSuccess()
      mock$.mockRejectedValueOnce(stringError)
      mockNormalizeError.mockReturnValue(normalizedError)

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow('Failed to create virtual environment')

      expect(mockNormalizeError).toHaveBeenCalledWith(
        stringError,
        'Failed to create virtual environment with uv'
      )
    })
  })

  describe('path construction', () => {
    it('should construct correct paths with different userDataPath', async () => {
      const customUserDataPath = '/custom/user/data'
      const customBackendPath = path.join(customUserDataPath, BACKEND_DIRNAME)
      const customVenvPath = path.join(customBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === customBackendPath) return Promise.resolve(true)
        if (targetPath === customVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: customUserDataPath,
        emit: mockEmit
      })

      expect(mockPathExists).toHaveBeenCalledWith(customBackendPath)
      expect(mockPathExists).toHaveBeenCalledWith(customVenvPath)

      expect(result).toEqual({
        venvPath: customVenvPath,
        backendPath: customBackendPath
      })
    })

    it('should handle relative paths correctly', async () => {
      const relativePath = './user/data'
      const relativeBackendPath = path.join(relativePath, BACKEND_DIRNAME)
      const relativeVenvPath = path.join(relativeBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === relativeBackendPath) return Promise.resolve(true)
        if (targetPath === relativeVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: relativePath,
        emit: mockEmit
      })

      expect(result).toEqual({
        venvPath: relativeVenvPath,
        backendPath: relativeBackendPath
      })
    })

    it('should handle Windows-style paths', async () => {
      const windowsPath = 'C:\\Users\\test\\data'
      const windowsBackendPath = path.join(windowsPath, BACKEND_DIRNAME)
      const windowsVenvPath = path.join(windowsBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === windowsBackendPath) return Promise.resolve(true)
        if (targetPath === windowsVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: windowsPath,
        emit: mockEmit
      })

      expect(result).toEqual({
        venvPath: windowsVenvPath,
        backendPath: windowsBackendPath
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty userDataPath', async () => {
      const emptyPath = ''
      const emptyBackendPath = path.join(emptyPath, BACKEND_DIRNAME)
      const emptyVenvPath = path.join(emptyBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === emptyBackendPath) return Promise.resolve(true)
        if (targetPath === emptyVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: emptyPath,
        emit: mockEmit
      })

      expect(result).toEqual({
        venvPath: emptyVenvPath,
        backendPath: emptyBackendPath
      })
    })

    it('should handle paths with spaces and special characters', async () => {
      const specialPath = '/path with spaces/special-chars_123'
      const specialBackendPath = path.join(specialPath, BACKEND_DIRNAME)
      const specialVenvPath = path.join(specialBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === specialBackendPath) return Promise.resolve(true)
        if (targetPath === specialVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: specialPath,
        emit: mockEmit
      })

      expect(result).toEqual({
        venvPath: specialVenvPath,
        backendPath: specialBackendPath
      })
    })
  })

  describe('command generation and execution', () => {
    it('should provide correct manual command in error message', async () => {
      const customUserDataPath = '/custom/user/data'
      const customBackendPath = path.join(customUserDataPath, BACKEND_DIRNAME)
      const customVenvPath = path.join(customBackendPath, '.venv')

      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === customBackendPath) return Promise.resolve(true)
        if (targetPath === customVenvPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mock$.mockRejectedValueOnce(new Error('Creation failed'))

      await expect(
        setupVenv({
          userDataPath: customUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message:
          'Failed to create virtual environment with uv. Run the command manually.',
        commands: [
          {
            label: 'Create virtual environment manually (uv)',
            command: `uv venv .venv --python 3.11`
          }
        ]
      })
    })

    it('falls back to python -m venv when uv is unavailable', async () => {
      mockUvCheckFailure()
      mock$.mockResolvedValueOnce({})

      const result = await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Creating virtual environment with Python 3.11…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Info,
        message: 'uv not found. Falling back to python -m venv'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(3, {
        level: BackendStatusLevel.Info,
        message: 'Virtual environment created successfully'
      })

      expect(result).toEqual({
        venvPath: expectedVenvPath,
        backendPath: expectedBackendPath
      })

      expect(mock$).toHaveBeenCalledTimes(2)
      expect(mockEmit).toHaveBeenCalledTimes(3)
    })

    it('should verify uv venv command execution', async () => {
      let commandExecuted = false
      mockUvCheckSuccess()
      mock$.mockImplementationOnce(() => {
        commandExecuted = true
        return Promise.resolve({})
      })

      await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      expect(commandExecuted).toBe(true)
      expect(mock$).toHaveBeenCalledTimes(2)
    })
  })

  describe('emit function calls', () => {
    it('should emit correct sequence of status messages for successful creation', async () => {
      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})

      await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Creating virtual environment with Python 3.11…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Info,
        message: 'Virtual environment created successfully'
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })

    it('should emit correct sequence for existing venv', async () => {
      mockPathExists.mockImplementation(() => {
        // Both backend and venv exist
        return Promise.resolve(true)
      })

      await setupVenv({
        userDataPath: mockUserDataPath,
        emit: mockEmit
      })

      expect(mockEmit).toHaveBeenCalledTimes(1)
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Info,
        message: 'Virtual environment already exists'
      })
    })

    it('should emit correct sequence for backend not found error', async () => {
      mockPathExists.mockImplementation((targetPath) => {
        if (targetPath === expectedBackendPath) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenCalledTimes(1)
      expect(mockEmit).toHaveBeenCalledWith({
        level: BackendStatusLevel.Error,
        message: 'Backend directory not found. Clone the backend first.'
      })
    })

    it('should emit correct sequence for venv creation failure', async () => {
      mockUvCheckSuccess()
      mock$.mockRejectedValueOnce(new Error('Command failed'))

      await expect(
        setupVenv({
          userDataPath: mockUserDataPath,
          emit: mockEmit
        })
      ).rejects.toThrow()

      expect(mockEmit).toHaveBeenNthCalledWith(1, {
        level: BackendStatusLevel.Info,
        message: 'Creating virtual environment with Python 3.11…'
      })

      expect(mockEmit).toHaveBeenNthCalledWith(2, {
        level: BackendStatusLevel.Error,
        message:
          'Failed to create virtual environment with uv. Run the command manually.',
        commands: [
          {
            label: 'Create virtual environment manually (uv)',
            command: `uv venv .venv --python 3.11`
          }
        ]
      })

      expect(mockEmit).toHaveBeenCalledTimes(2)
    })
  })

  describe('concurrent operations', () => {
    it('should handle multiple concurrent setupVenv calls', async () => {
      const userPaths = ['/path1', '/path2', '/path3']
      const backendPaths = userPaths.map((p) => path.join(p, BACKEND_DIRNAME))
      const venvPaths = backendPaths.map((p) => path.join(p, '.venv'))

      // Mock paths for all concurrent calls
      mockPathExists.mockImplementation((targetPath) => {
        if (backendPaths.includes(targetPath)) return Promise.resolve(true)
        if (venvPaths.includes(targetPath)) return Promise.resolve(false)
        return Promise.resolve(false)
      })

      mockUvCheckSuccess()
      mockUvCheckSuccess()
      mockUvCheckSuccess()
      mock$.mockResolvedValueOnce({})
      mock$.mockResolvedValueOnce({})
      mock$.mockResolvedValueOnce({})

      const promises = [
        setupVenv({ userDataPath: '/path1', emit: mockEmit }),
        setupVenv({ userDataPath: '/path2', emit: mockEmit }),
        setupVenv({ userDataPath: '/path3', emit: mockEmit })
      ]

      await Promise.all(promises)

      // Each call should check backend and venv paths
      expect(mockPathExists).toHaveBeenCalledTimes(6) // 3 calls × 2 checks each
      // Each call should execute uv detection and venv creation
      expect(mock$).toHaveBeenCalledTimes(6)
      // Each call should emit 2 status messages (creating + success)
      expect(mockEmit).toHaveBeenCalledTimes(6)
    })
  })
})

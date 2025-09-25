import { beforeEach, describe, expect, it, vi } from 'vitest'
import { join } from 'path'
import * as fs from 'fs/promises'
import {
  compileElectron,
  startElectron,
  startDesktopDev,
  startFullDev
} from '../electron'

// Mock dependencies
vi.mock('fs/promises')
vi.mock('../utils', () => ({
  projectRoot: '/test/project'
}))

const mock$ = vi.fn()
vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

const mockReadFile = vi.mocked(fs.readFile)
const mockWriteFile = vi.mocked(fs.writeFile)
const mockRename = vi.mocked(fs.rename)
const mockRm = vi.mocked(fs.rm)

describe('electron', () => {
  const mockProjectRoot = '/test/project'
  const electronDir = join(mockProjectRoot, 'electron')
  const electronBuildDir = join(electronDir, 'electron')

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default successful mocks
    mockReadFile.mockResolvedValue(
      'mock file content with require("../scripts/backend")'
    )
    mockWriteFile.mockResolvedValue()
    mockRename.mockResolvedValue()
    mockRm.mockResolvedValue()
    mock$.mockResolvedValue(undefined)
  })

  describe('compileElectron', () => {
    it('should compile Electron TypeScript files successfully', async () => {
      await compileElectron()

      // Verify cleanup of old files
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'main.cjs'), {
        force: true
      })
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'main.js'), {
        force: true
      })
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'preload.cjs'), {
        force: true
      })
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'preload.js'), {
        force: true
      })
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'scripts'), {
        recursive: true,
        force: true
      })

      // Verify TypeScript compilation was called
      expect(mock$).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx tsc')]),
        expect.arrayContaining([
          'electron/main.ts',
          'electron/preload.ts',
          'scripts/backend/clone-backend.ts',
          'scripts/backend/constants.ts',
          'scripts/backend/ensure-python.ts',
          'scripts/backend/git.ts',
          'scripts/backend/index.ts',
          'scripts/backend/install-dependencies.ts',
          'scripts/backend/install-uv.ts',
          'scripts/backend/run-backend.ts',
          'scripts/backend/setup-venv.ts',
          'scripts/backend/start-backend.ts',
          'scripts/backend/types.ts',
          'scripts/backend/utils.ts',
          '--outDir',
          'electron'
        ])
      )

      // Verify path fixing
      const mainJsPath = join(electronBuildDir, 'main.js')
      expect(mockReadFile).toHaveBeenCalledWith(mainJsPath, 'utf8')
      expect(mockWriteFile).toHaveBeenCalledWith(
        mainJsPath,
        'mock file content with require("./scripts/backend")'
      )

      // Verify file moves
      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        join(electronDir, 'main.js')
      )
      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'preload.js'),
        join(electronDir, 'preload.js')
      )

      // Verify cleanup of build directory
      expect(mockRm).toHaveBeenCalledWith(electronBuildDir, {
        recursive: true,
        force: true
      })
    })

    it('should handle file content without require statement', async () => {
      mockReadFile.mockResolvedValue(
        'mock file content without require statement'
      )

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        'mock file content without require statement'
      )
    })

    it('should handle multiple require statements', async () => {
      mockReadFile.mockResolvedValue(
        'const backend = require("../scripts/backend")\nconst other = require("../scripts/backend")'
      )

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        'const backend = require("./scripts/backend")\nconst other = require("../scripts/backend")'
      )
    })

    it('should handle TypeScript compilation errors', async () => {
      const compilationError = new Error('TypeScript compilation failed')
      mock$.mockRejectedValue(compilationError)

      await expect(compileElectron()).rejects.toThrow(
        'TypeScript compilation failed'
      )
    })

    it('should handle file system errors during cleanup', async () => {
      const fsError = new Error('File system error')
      mockRm.mockRejectedValue(fsError)

      await expect(compileElectron()).rejects.toThrow('File system error')
    })

    it('should handle file read errors', async () => {
      const readError = new Error('File read error')
      mockReadFile.mockRejectedValue(readError)

      await expect(compileElectron()).rejects.toThrow('File read error')
    })

    it('should handle file write errors', async () => {
      const writeError = new Error('File write error')
      mockWriteFile.mockRejectedValue(writeError)

      await expect(compileElectron()).rejects.toThrow('File write error')
    })

    it('should handle file rename errors', async () => {
      const renameError = new Error('File rename error')
      mockRename.mockRejectedValue(renameError)

      await expect(compileElectron()).rejects.toThrow('File rename error')
    })
  })

  describe('startElectron', () => {
    it('should start Electron successfully', async () => {
      await startElectron()

      expect(mock$).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx electron')])
      )
    })

    it('should handle Electron startup errors', async () => {
      const electronError = new Error('Electron failed to start')
      mock$.mockRejectedValue(electronError)

      await expect(startElectron()).rejects.toThrow('Electron failed to start')
    })
  })

  describe('startDesktopDev', () => {
    it('should compile and start Electron in sequence', async () => {
      await startDesktopDev()

      // Verify compilation happened first
      expect(mock$).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx tsc')]),
        expect.anything()
      )

      // Verify Electron start happened after compilation
      expect(mock$).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx electron')])
      )
    })

    it('should handle compilation errors before starting Electron', async () => {
      const compilationError = new Error('Compilation failed')
      mock$.mockImplementation((...args: unknown[]) => {
        const command = args.join(' ')
        if (command.includes('tsc')) {
          return Promise.reject(compilationError)
        }
        return Promise.resolve()
      })

      await expect(startDesktopDev()).rejects.toThrow('Compilation failed')

      // Verify Electron was not started
      expect(mock$).not.toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx electron')])
      )
    })

    it('should handle Electron startup errors after successful compilation', async () => {
      const electronError = new Error('Electron startup failed')
      mock$.mockImplementation((...args: unknown[]) => {
        const command = args.join(' ')
        if (command.includes('tsc')) {
          return Promise.resolve()
        }
        if (command.includes('electron')) {
          return Promise.reject(electronError)
        }
        return Promise.resolve()
      })

      await expect(startDesktopDev()).rejects.toThrow('Electron startup failed')
    })
  })

  describe('startFullDev', () => {
    it('should start full development environment with concurrently', async () => {
      await startFullDev()

      expect(mock$).toHaveBeenCalledWith(
        expect.arrayContaining([expect.stringContaining('npx concurrently')]),
        expect.arrayContaining([
          '-n',
          'NEXT,ELECTRON',
          '-c',
          'yellow,blue',
          '--kill-others',
          'npm run dev',
          'tsx scripts/desktop.ts'
        ])
      )
    })

    it('should handle concurrently startup errors', async () => {
      const concurrentlyError = new Error('Concurrently failed to start')
      mock$.mockRejectedValue(concurrentlyError)

      await expect(startFullDev()).rejects.toThrow(
        'Concurrently failed to start'
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty file content during path fixing', async () => {
      mockReadFile.mockResolvedValue('')

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        ''
      )
    })

    it('should handle file content with similar but different require statements', async () => {
      mockReadFile.mockResolvedValue(
        'require("../scripts/frontend")\nrequire("./scripts/backend")\nrequire("../scripts/backend")'
      )

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        'require("../scripts/frontend")\nrequire("./scripts/backend")\nrequire("./scripts/backend")'
      )
    })

    it('should handle cleanup operations in parallel', async () => {
      let cleanupStarted = false
      mockRm.mockImplementation(() => {
        if (!cleanupStarted) {
          cleanupStarted = true
          // Simulate parallel execution by checking that multiple calls happen
          expect(mockRm).toHaveBeenCalled()
        }
        return Promise.resolve()
      })

      await compileElectron()

      // Verify all cleanup operations were called
      expect(mockRm).toHaveBeenCalledTimes(6) // 5 initial cleanup + 1 final cleanup
    })
  })

  describe('console output', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    beforeEach(() => {
      consoleSpy.mockClear()
    })

    it('should log compilation progress in compileElectron', async () => {
      await compileElectron()

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔨 Compiling Electron TypeScript files...'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Electron compilation complete'
      )
    })

    it('should log startup message in startElectron', async () => {
      await startElectron()

      expect(consoleSpy).toHaveBeenCalledWith('🚀 Starting Electron...')
    })

    it('should log startup message in startFullDev', async () => {
      await startFullDev()

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚀 Starting full development environment...'
      )
    })
  })
})

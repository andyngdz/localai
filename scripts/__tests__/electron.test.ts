import * as fs from 'fs/promises'
import { join } from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { startDesktopDev } from '../desktop'
import { concurrentlyArgs, startFullDev } from '../devall'
import { compileElectron, startElectron } from '../electron'

const { mock$, recordedCommands } = vi.hoisted(() => {
  return {
    mock$: vi.fn(),
    recordedCommands: [] as string[]
  }
})

const { runAsScriptMock, runAsScriptCalls } = vi.hoisted(() => {
  const calls: Array<{ task: () => Promise<void>; message: string }> = []
  const mockFn = vi.fn(async (task: () => Promise<void>, message: string) => {
    calls.push({ task, message })
  })
  return { runAsScriptMock: mockFn, runAsScriptCalls: calls }
})

vi.mock('fs/promises')
vi.mock('../utils', () => ({
  projectRoot: '/test/project',
  runAsScript: runAsScriptMock,
  setupLog: vi.fn()
}))
vi.mock('zx', () => ({
  $: (...args: unknown[]) => mock$(...args)
}))

const mockReadFile = vi.mocked(fs.readFile)
const mockWriteFile = vi.mocked(fs.writeFile)
const mockRename = vi.mocked(fs.rename)
const mockRm = vi.mocked(fs.rm)
const mockMkdir = vi.mocked(fs.mkdir)
const mockCp = vi.mocked(fs.cp)

const toCommandString = (pieces: TemplateStringsArray, args: unknown[]) =>
  pieces.reduce((acc, part, index) => {
    const interpolation = index < args.length ? String(args[index]) : ''
    return acc + part + interpolation
  }, '')

describe('electron toolchain', () => {
  const mockProjectRoot = '/test/project'
  const electronDir = join(mockProjectRoot, 'electron')
  const electronBuildDir = join(electronDir, 'electron')
  const compiledTypesDir = join(electronDir, 'types')
  const runtimeTypesDir = join(electronDir, 'node_modules', '@types')

  beforeEach(() => {
    vi.clearAllMocks()
    recordedCommands.length = 0

    mockReadFile.mockResolvedValue(
      'mock file content with require("../scripts/backend")'
    )
    mockWriteFile.mockResolvedValue()
    mockRename.mockResolvedValue()
    mockRm.mockResolvedValue()
    mockMkdir.mockReturnThis()
    mockCp.mockResolvedValue()

    mock$.mockImplementation(
      (pieces: TemplateStringsArray, ...args: unknown[]) => {
        recordedCommands.push(toCommandString(pieces, args).trim())
        return Promise.resolve()
      }
    )
  })

  describe('compileElectron', () => {
    it('compiles Electron TypeScript sources', async () => {
      await compileElectron()

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
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'updater.js'), {
        force: true
      })
      expect(mockRm).toHaveBeenCalledWith(join(electronDir, 'scripts'), {
        recursive: true,
        force: true
      })

      expect(recordedCommands[0]).toBe(
        'npx tsc --project,tsconfig.electron.json'
      )

      const mainJsPath = join(electronBuildDir, 'main.js')
      expect(mockReadFile).toHaveBeenCalledWith(mainJsPath, 'utf8')
      expect(mockWriteFile).toHaveBeenCalledWith(
        mainJsPath,
        'mock file content with require("./scripts/backend")'
      )

      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        join(electronDir, 'main.js')
      )
      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'preload.js'),
        join(electronDir, 'preload.js')
      )
      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'log-streamer.js'),
        join(electronDir, 'log-streamer.js')
      )
      expect(mockRename).toHaveBeenCalledWith(
        join(electronBuildDir, 'updater.js'),
        join(electronDir, 'updater.js')
      )

      expect(mockRm).toHaveBeenCalledWith(runtimeTypesDir, {
        recursive: true,
        force: true
      })
      expect(mockMkdir).toHaveBeenCalledWith(runtimeTypesDir, {
        recursive: true
      })
      expect(mockCp).toHaveBeenCalledWith(compiledTypesDir, runtimeTypesDir, {
        recursive: true
      })

      expect(mockRm).toHaveBeenCalledWith(electronBuildDir, {
        recursive: true,
        force: true
      })
    })

    it('handles TypeScript compilation failures', async () => {
      const compilationError = new Error('TypeScript compilation failed')
      mock$.mockImplementation(
        (pieces: TemplateStringsArray, ...args: unknown[]) => {
          recordedCommands.push(toCommandString(pieces, args).trim())
          return Promise.reject(compilationError)
        }
      )

      await expect(compileElectron()).rejects.toThrow(
        'TypeScript compilation failed'
      )
    })

    it('handles file-system failures', async () => {
      const fsError = new Error('File system error')
      mockRm.mockRejectedValue(fsError)

      await expect(compileElectron()).rejects.toThrow('File system error')
    })

    it('handles read failures', async () => {
      const readError = new Error('File read error')
      mockReadFile.mockRejectedValue(readError)

      await expect(compileElectron()).rejects.toThrow('File read error')
    })

    it('handles write failures', async () => {
      const writeError = new Error('File write error')
      mockWriteFile.mockRejectedValue(writeError)

      await expect(compileElectron()).rejects.toThrow('File write error')
    })

    it('handles rename failures', async () => {
      const renameError = new Error('File rename error')
      mockRename.mockRejectedValue(renameError)

      await expect(compileElectron()).rejects.toThrow('File rename error')
    })

    it('handles missing require statements gracefully', async () => {
      mockReadFile.mockResolvedValue('plain content')

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        'plain content'
      )
    })

    it('handles mixed require statements', async () => {
      mockReadFile.mockResolvedValue(
        'require("../scripts/frontend")\nrequire("./scripts/backend")\nrequire("../scripts/backend")'
      )

      await compileElectron()

      expect(mockWriteFile).toHaveBeenCalledWith(
        join(electronBuildDir, 'main.js'),
        'require("../scripts/frontend")\nrequire("./scripts/backend")\nrequire("./scripts/backend")'
      )
    })

    it('processes cleanup operations in parallel', async () => {
      let cleanupObserved = false
      mockRm.mockImplementation(() => {
        cleanupObserved = true
        return Promise.resolve()
      })

      await compileElectron()

      expect(cleanupObserved).toBe(true)
      expect(mockRm).toHaveBeenCalledTimes(9)
    })
  })

  describe('startElectron', () => {
    it('runs the Electron binary', async () => {
      await startElectron()

      expect(recordedCommands).toEqual(['npx electron .'])
    })

    it('surfaces Electron start failures', async () => {
      const electronError = new Error('Electron failed to start')
      mock$.mockImplementation(
        (pieces: TemplateStringsArray, ...args: unknown[]) => {
          recordedCommands.push(toCommandString(pieces, args).trim())
          return Promise.reject(electronError)
        }
      )

      await expect(startElectron()).rejects.toThrow('Electron failed to start')
    })
  })

  describe('startDesktopDev', () => {
    it('compiles and launches Electron sequentially', async () => {
      await startDesktopDev()

      expect(recordedCommands[0]).toContain('npx tsc ')
      expect(recordedCommands[1]).toBe('npx electron .')
    })

    it('prevents Electron start when compilation fails', async () => {
      const compilationError = new Error('Compilation failed')
      mock$.mockImplementation(
        (pieces: TemplateStringsArray, ...args: unknown[]) => {
          const command = toCommandString(pieces, args).trim()
          recordedCommands.push(command)
          if (command.includes('npx tsc')) {
            return Promise.reject(compilationError)
          }
          return Promise.resolve()
        }
      )

      await expect(startDesktopDev()).rejects.toThrow('Compilation failed')
      expect(recordedCommands).toHaveLength(1)
      expect(recordedCommands[0]).toContain('npx tsc ')
    })

    it('surfaces Electron failures after successful compilation', async () => {
      const electronError = new Error('Electron startup failed')
      mock$.mockImplementation(
        (pieces: TemplateStringsArray, ...args: unknown[]) => {
          const command = toCommandString(pieces, args).trim()
          recordedCommands.push(command)
          if (command.includes('npx electron')) {
            return Promise.reject(electronError)
          }
          return Promise.resolve()
        }
      )

      await expect(startDesktopDev()).rejects.toThrow('Electron startup failed')
      expect(recordedCommands[0]).toContain('npx tsc ')
      expect(recordedCommands[1]).toBe('npx electron .')
    })
  })

  describe('startFullDev', () => {
    it('runs concurrently with predefined arguments', async () => {
      await startFullDev()

      expect(recordedCommands[0]).toContain('npx concurrently ')
      concurrentlyArgs.forEach((arg) => {
        expect(recordedCommands[0]).toContain(String(arg))
      })
    })

    it('surfaces concurrently failures', async () => {
      const concurrentlyError = new Error('Concurrently failed to start')
      mock$.mockImplementation(
        (pieces: TemplateStringsArray, ...args: unknown[]) => {
          recordedCommands.push(toCommandString(pieces, args).trim())
          return Promise.reject(concurrentlyError)
        }
      )

      await expect(startFullDev()).rejects.toThrow(
        'Concurrently failed to start'
      )
    })
  })

  describe('console output', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    beforeEach(() => {
      consoleSpy.mockClear()
    })

    it('logs compilation progress', async () => {
      await compileElectron()

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔨 Compiling Electron TypeScript files...'
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Electron compilation complete'
      )
    })

    it('logs Electron startup', async () => {
      await startElectron()

      expect(consoleSpy).toHaveBeenCalledWith('🚀 Starting Electron...')
    })

    it('logs full environment startup', async () => {
      await startFullDev()

      expect(consoleSpy).toHaveBeenCalledWith(
        '🚀 Starting full development environment...'
      )
    })
  })

  it('registers desktop and full dev scripts via runAsScript', () => {
    expect(runAsScriptCalls).toHaveLength(2)
    expect(runAsScriptCalls.map((call) => call.message)).toEqual([
      '❌ Desktop development failed:',
      '❌ Full development startup failed:'
    ])
  })
})

import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { projectRoot, runAsScript } from '../utils'

describe('projectRoot', () => {
  it('resolves to the repository root directory', () => {
    const expectedRoot = process.cwd()
    expect(projectRoot).toBe(expectedRoot)
  })
})

describe('runAsScript', () => {
  let exitSpy: MockInstance<(code?: string) => never>
  let consoleErrorSpy: MockInstance<
    (message?: unknown, ...optionalParams: unknown[]) => void
  >

  beforeEach(() => {
    const noopExit = (() => undefined) as typeof process.exit
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(noopExit)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    exitSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it('executes the task without exiting when it resolves', async () => {
    const task = vi.fn().mockResolvedValue(undefined)

    await runAsScript(task, 'Task failed:')

    expect(task).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).not.toHaveBeenCalled()
    expect(exitSpy).not.toHaveBeenCalled()
  })

  it('logs the failure and exits when the task rejects', async () => {
    const failure = new Error('Boom')
    const task = vi.fn().mockRejectedValue(failure)

    await runAsScript(task, 'Task failed:')

    expect(task).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith('Task failed:', 'Boom')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})

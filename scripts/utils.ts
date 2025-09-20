import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const projectRoot = join(__dirname, '..')

const isWindows = process.platform === 'win32'

export interface RunCommandOptions {
  stdio?: 'inherit' | 'pipe' | 'ignore'
  shell?: boolean
  cwd?: string
}

export const runCommand = (command: string, args: string[], options: RunCommandOptions = {}) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: isWindows,
      cwd: projectRoot,
      ...options
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })

    child.on('error', reject)
  })

export const runAsScript = async (task: () => Promise<void>, failureMessage: string) => {
  try {
    await task()
  } catch (error) {
    console.error(failureMessage, (error as Error).message)
    process.exit(1)
  }
}

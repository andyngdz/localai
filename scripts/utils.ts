import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { $ } from 'zx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const runAsScript = async (
  task: () => Promise<void>,
  failureMessage: string
) => {
  try {
    await task()
  } catch (error) {
    console.error(failureMessage, (error as Error).message)
    process.exit(1)
  }
}

const setupLog = (shell: $) => {
  process.env.FORCE_COLOR = '1'
  shell.verbose = true
  shell.stdio = 'inherit'
}

export { runAsScript, setupLog, projectRoot, __dirname, __filename }

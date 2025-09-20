import { spawn } from 'child_process'

interface RunCommandOptions {
  cwd?: string
  env?: NodeJS.ProcessEnv
}

interface RunCommandResult {
  stdout: string
  stderr: string
}

export const runCommand = (
  command: string,
  args: string[],
  options: RunCommandOptions = {}
): Promise<RunCommandResult> => {
  return new Promise((resolve, reject) => {
    const isShell = process.platform === 'win32'

    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      shell: isShell
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('error', reject)

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        const formattedArgs = args.join(' ')
        const message = `Command \"${command} ${formattedArgs}\" exited with code ${code}. ${stderr}`
        reject(new Error(message))
      }
    })
  })
}

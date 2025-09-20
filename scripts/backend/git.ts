import { runCommand } from './run-command'

export const isGitAvailable = async (): Promise<boolean> => {
  try {
    await runCommand('git', ['--version'])
    return true
  } catch (error) {
    return false
  }
}

export const cloneRepository = async (
  repoUrl: string,
  destination: string,
  branch: string
) => {
  await runCommand('git', [
    'clone',
    '--branch',
    branch,
    '--single-branch',
    repoUrl,
    destination
  ])
}

export const updateRepository = async (repoPath: string, branch: string) => {
  await runCommand('git', ['fetch', 'origin', branch], { cwd: repoPath })
  await runCommand('git', ['checkout', branch], { cwd: repoPath })
  await runCommand('git', ['pull', 'origin', branch], { cwd: repoPath })
}

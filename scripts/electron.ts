import { rename } from 'fs/promises'
import { join } from 'path'
import { projectRoot, runCommand } from './utils'

const electronSourceFiles = ['electron/main.ts', 'electron/preload.ts'] as const

const tscArgs = [
  ...electronSourceFiles,
  '--outDir',
  'electron',
  '--target',
  'es2020',
  '--module',
  'commonjs',
  '--moduleResolution',
  'node',
  '--esModuleInterop',
  '--allowSyntheticDefaultImports',
  '--skipLibCheck'
]

const concurrentlyArgs = [
  '-n',
  'NEXT,ELECTRON',
  '-c',
  'yellow,blue',
  '--kill-others',
  'npm run dev',
  'tsx scripts/desktop.ts'
]

const electronDir = join(projectRoot, 'electron')

export const compileElectron = async () => {
  console.log('🔨 Compiling Electron TypeScript files...')

  await runCommand('npx', ['tsc', ...tscArgs])

  await rename(join(electronDir, 'main.js'), join(electronDir, 'main.cjs'))
  await rename(join(electronDir, 'preload.js'), join(electronDir, 'preload.cjs'))

  console.log('✅ Electron compilation complete')
}

export const startElectron = async () => {
  console.log('🚀 Starting Electron...')
  await runCommand('npx', ['electron', '.'])
}

export const startDesktopDev = async () => {
  await compileElectron()
  await startElectron()
}

export const startFullDev = async () => {
  console.log('🚀 Starting full development environment...')
  await runCommand('npx', ['concurrently', ...concurrentlyArgs])
}

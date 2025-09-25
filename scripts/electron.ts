import { readFile, rename, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { $ } from 'zx'
import { projectRoot } from './utils'

process.env.FORCE_COLOR = '1'
$.stdio = 'inherit'
$.verbose = true

const electronSourceFiles = ['electron/main.ts', 'electron/preload.ts'] as const
const backendSourceFiles = [
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
  'scripts/backend/utils.ts'
] as const

const tscArgs = [
  ...electronSourceFiles,
  ...backendSourceFiles,
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
const electronBuildDir = join(electronDir, 'electron')

export const compileElectron = async () => {
  console.log('🔨 Compiling Electron TypeScript files...')

  await Promise.all([
    rm(join(electronDir, 'main.cjs'), { force: true }),
    rm(join(electronDir, 'main.js'), { force: true }),
    rm(join(electronDir, 'preload.cjs'), { force: true }),
    rm(join(electronDir, 'preload.js'), { force: true }),
    rm(join(electronDir, 'scripts'), { recursive: true, force: true })
  ])

  await $`npx tsc ${tscArgs}`

  // Fix import paths in main.js before renaming
  const mainJsPath = join(electronBuildDir, 'main.js')
  let mainContent = await readFile(mainJsPath, 'utf8')
  mainContent = mainContent.replace(
    'require("../scripts/backend")',
    'require("./scripts/backend")'
  )
  await writeFile(mainJsPath, mainContent)

  await rename(join(electronBuildDir, 'main.js'), join(electronDir, 'main.js'))
  await rename(
    join(electronBuildDir, 'preload.js'),
    join(electronDir, 'preload.js')
  )

  await rm(electronBuildDir, { recursive: true, force: true })

  console.log('✅ Electron compilation complete')
}

export const startElectron = async () => {
  console.log('🚀 Starting Electron...')
  await $`npx electron .`
}

export const startDesktopDev = async () => {
  await compileElectron()
  await startElectron()
}

export const startFullDev = async () => {
  console.log('🚀 Starting full development environment...')
  await $`npx concurrently ${concurrentlyArgs}`
}

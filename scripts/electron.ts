import { cp, mkdir, readFile, rename, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { $ } from 'zx'
import { projectRoot, setupLog } from './utils'

setupLog($)

const electronSourceFiles = ['electron/main.ts', 'electron/preload.ts']
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
  'scripts/backend/utils.ts'
]

const tscArgs = ['--project', 'tsconfig.electron.json']

const electronDir = join(projectRoot, 'electron')
const electronBuildDir = join(electronDir, 'electron')
const compiledTypesDir = join(electronDir, 'types')
const runtimeTypesDir = join(electronDir, 'node_modules', '@types')

const cleanElectronOutputs = async () => {
  await Promise.all([
    rm(join(electronDir, 'main.cjs'), { force: true }),
    rm(join(electronDir, 'main.js'), { force: true }),
    rm(join(electronDir, 'preload.cjs'), { force: true }),
    rm(join(electronDir, 'preload.js'), { force: true }),
    rm(join(electronDir, 'scripts'), { recursive: true, force: true }),
    rm(join(electronDir, 'types'), { recursive: true, force: true })
  ])
}

const transpileElectronSources = async () => {
  await $`npx tsc ${tscArgs}`
}

const patchMainImport = async () => {
  const mainJsPath = join(electronBuildDir, 'main.js')
  const mainContent = await readFile(mainJsPath, 'utf8')

  await writeFile(
    mainJsPath,
    mainContent.replace(
      'require("../scripts/backend")',
      'require("./scripts/backend")'
    )
  )
}

const relocateCompiledArtifacts = async () => {
  await rename(join(electronBuildDir, 'main.js'), join(electronDir, 'main.js'))
  await rename(
    join(electronBuildDir, 'preload.js'),
    join(electronDir, 'preload.js')
  )
  await rename(
    join(electronBuildDir, 'log-streamer.js'),
    join(electronDir, 'log-streamer.js')
  )
}

const syncRuntimeTypes = async () => {
  await rm(runtimeTypesDir, { recursive: true, force: true })
  await mkdir(runtimeTypesDir, { recursive: true })
  await cp(compiledTypesDir, runtimeTypesDir, { recursive: true })
}

const finalizeTranspileArtifacts = async () => {
  await rm(electronBuildDir, { recursive: true, force: true })
}

const compileElectron = async () => {
  console.log('🔨 Compiling Electron TypeScript files...')

  await cleanElectronOutputs()
  await transpileElectronSources()
  await patchMainImport()
  await relocateCompiledArtifacts()
  await syncRuntimeTypes()
  await finalizeTranspileArtifacts()

  console.log('✅ Electron compilation complete')
}

const startElectron = async () => {
  console.log('🚀 Starting Electron...')
  await $`npx electron .`
}

export {
  compileElectron,
  startElectron,
  electronSourceFiles,
  backendSourceFiles,
  tscArgs,
  electronBuildDir,
  electronDir
}

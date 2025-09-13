#!/usr/bin/env node
import { rename } from 'fs/promises'
import { join } from 'path'
import { projectRoot, runCommand } from './utils'

async function compileElectron(): Promise<void> {
  console.log('🔨 Compiling Electron TypeScript files...')

  const tscArgs = [
    'electron/main.ts',
    'electron/preload.ts',
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

  try {
    await runCommand('npx', ['tsc', ...tscArgs])

    // Rename .js files to .cjs for CommonJS compatibility
    await rename(join(projectRoot, 'electron/main.js'), join(projectRoot, 'electron/main.cjs'))
    await rename(
      join(projectRoot, 'electron/preload.js'),
      join(projectRoot, 'electron/preload.cjs')
    )

    console.log('✅ Electron compilation complete')
  } catch (error) {
    console.error('❌ Electron compilation failed:', (error as Error).message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  compileElectron()
}

export { compileElectron }

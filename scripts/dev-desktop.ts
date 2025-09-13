#!/usr/bin/env node
import { compileElectron } from './build-electron'
import { runCommand } from './utils'

async function startDesktopDev(): Promise<void> {
  try {
    // Compile Electron files first
    await compileElectron()

    // Start Electron
    console.log('🚀 Starting Electron...')
    await runCommand('npx', ['electron', '.'])
  } catch (error) {
    console.error('❌ Desktop development failed:', (error as Error).message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startDesktopDev()
}

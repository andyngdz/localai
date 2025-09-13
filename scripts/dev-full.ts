#!/usr/bin/env node
import { runCommand } from './utils'

async function startFullDev(): Promise<void> {
  try {
    console.log('🚀 Starting full development environment...')

    const concurrentlyArgs = [
      '-n',
      'NEXT,ELECTRON',
      '-c',
      'yellow,blue',
      '--kill-others',
      'npm run dev',
      'tsx scripts/dev-desktop.ts'
    ]

    await runCommand('npx', ['concurrently', ...concurrentlyArgs])
  } catch (error) {
    console.error('❌ Full development startup failed:', (error as Error).message)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startFullDev()
}

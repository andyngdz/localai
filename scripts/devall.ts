#!/usr/bin/env node
import { $ } from 'zx'
import { runAsScript, setupLog } from './utils'

setupLog($)

const concurrentlyArgs = [
  '-n',
  'NEXT,ELECTRON',
  '-c',
  'yellow,blue',
  '--kill-others',
  'npm run dev',
  'tsx scripts/desktop.ts'
]

const startFullDev = async () => {
  console.log('Starting full development environment...')
  await $`npx concurrently ${concurrentlyArgs}`
}

runAsScript(startFullDev, 'Full development startup failed:')

export { concurrentlyArgs, startFullDev }

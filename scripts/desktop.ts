#!/usr/bin/env node
import { compileElectron, startElectron } from './electron'
import { runAsScript } from './utils'

const startDesktopDev = async () => {
  await compileElectron()
  await startElectron()
}

runAsScript(startDesktopDev, '❌ Desktop development failed:')

export { startDesktopDev }

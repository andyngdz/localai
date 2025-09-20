#!/usr/bin/env node
import { compileElectron } from './electron'
import { runAsScript } from './utils'

runAsScript(compileElectron, '❌ Electron compilation failed:')

export { compileElectron } from './electron'

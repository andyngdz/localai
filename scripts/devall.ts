#!/usr/bin/env node
import { startFullDev } from './electron'
import { runAsScript } from './utils'

runAsScript(startFullDev, '❌ Full development startup failed:')

export { startFullDev } from './electron'

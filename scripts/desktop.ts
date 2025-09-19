#!/usr/bin/env node
import { startDesktopDev } from './electron'
import { runAsScript } from './utils'

runAsScript(startDesktopDev, '❌ Desktop development failed:')

export { startDesktopDev } from './electron'

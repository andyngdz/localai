import type { LogLevel } from '@types'
import { BrowserWindow } from 'electron'

let isStreaming = false
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
}

const sendLog = (level: LogLevel, message: string) => {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send('backend:log', {
        level,
        message,
        timestamp: Date.now()
      })
    }
  })
}

const intercept = (level: LogLevel, original: typeof console.log) => {
  return (...args: unknown[]) => {
    original(...args)
    if (isStreaming) {
      const message = args.map((arg) => String(arg)).join(' ')
      sendLog(level, message)
    }
  }
}

export const startLogStreaming = () => {
  if (isStreaming) return
  isStreaming = true
  console.log = intercept('log', originalConsole.log)
  console.info = intercept('info', originalConsole.info)
  console.warn = intercept('warn', originalConsole.warn)
  console.error = intercept('error', originalConsole.error)
}

export const stopLogStreaming = () => {
  if (!isStreaming) return
  isStreaming = false
  console.log = originalConsole.log
  console.info = originalConsole.info
  console.warn = originalConsole.warn
  console.error = originalConsole.error
}

export const isLogStreaming = () => isStreaming

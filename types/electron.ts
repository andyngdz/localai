// Electron API types shared between main process, preload, and frontend

import { BackendStatusEmitter } from './backend'
import { LogEntry } from './logging'
import { UpdateCheckResult } from './update'

export interface ElectronAPI {
  downloadImage: (url: string) => Promise<void>
  onBackendSetupStatus: (listener: BackendStatusEmitter) => () => void
  app: {
    getVersion: () => Promise<string>
  }
  backend: {
    getPort: () => Promise<number>
    startLogStream: () => Promise<void>
    stopLogStream: () => Promise<void>
    isLogStreaming: () => Promise<boolean>
    onLog: (listener: (logEntry: LogEntry) => void) => () => void
  }
  updater: {
    checkForUpdates: () => Promise<UpdateCheckResult>
    installUpdate: () => Promise<void>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

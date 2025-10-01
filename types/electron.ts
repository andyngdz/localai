// Electron API types shared between main process, preload, and frontend

import type { BackendStatusEmitter } from './backend'
import type { LogEntry } from './logging'

export interface ElectronAPI {
  downloadImage: (url: string) => Promise<void>
  onBackendSetupStatus: (listener: BackendStatusEmitter) => () => void
  backend: {
    startLogStream: () => Promise<void>
    stopLogStream: () => Promise<void>
    isLogStreaming: () => Promise<boolean>
    onLog: (listener: (logEntry: LogEntry) => void) => () => void
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

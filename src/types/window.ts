import { BackendStatusEmitter } from './base'

export interface LogEntry {
  level: string
  message: string
  timestamp: number
}

declare global {
  interface Window {
    electronAPI: {
      downloadImage: (url: string) => Promise<void>
      onBackendSetupStatus: (listener: BackendStatusEmitter) => () => void
      backend: {
        startLogStream: () => Promise<void>
        stopLogStream: () => Promise<void>
        isLogStreaming: () => Promise<boolean>
        onLog: (listener: (logEntry: LogEntry) => void) => () => void
      }
    }
  }
}

export {}

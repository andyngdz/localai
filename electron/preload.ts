import { contextBridge, ipcRenderer } from 'electron'
import type {
  BackendStatusEmitter,
  BackendStatusPayload
} from '../scripts/backend'

interface LogEntry {
  level: string
  message: string
  timestamp: number
}

contextBridge.exposeInMainWorld('electronAPI', {
  downloadImage: (url: string) => ipcRenderer.invoke('download-image', url),
  onBackendSetupStatus: (listener: BackendStatusEmitter) => {
    const channel = 'backend-setup:status'
    const subscription = (
      _event: Electron.IpcRendererEvent,
      payload: BackendStatusPayload
    ) => {
      listener(payload)
    }

    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  backend: {
    startLogStream: () => ipcRenderer.invoke('backend:start-log-stream'),
    stopLogStream: () => ipcRenderer.invoke('backend:stop-log-stream'),
    isLogStreaming: () => ipcRenderer.invoke('backend:log-stream-status'),
    onLog: (listener: (logEntry: LogEntry) => void) => {
      const subscription = (
        _: Electron.IpcRendererEvent,
        logEntry: LogEntry
      ) => {
        listener(logEntry)
      }

      ipcRenderer.on('backend:log', subscription)

      return () => {
        ipcRenderer.removeListener('backend:log', subscription)
      }
    }
  }
})

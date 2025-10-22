import type {
  BackendStatusEmitter,
  BackendStatusPayload,
  LogEntry,
  UpdateInfo
} from '@types'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  downloadImage: (url: string) => ipcRenderer.invoke('download-image', url),
  onBackendSetupStatus: (listener: BackendStatusEmitter) => {
    const channel = 'backend-setup:status'
    ipcRenderer
      .invoke('backend-setup:get-history')
      .then((history: BackendStatusPayload[]) => {
        history.forEach((payload) => listener(payload))
      })
      .catch(() => {
        // ignore history fetch errors
      })

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
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version')
  },
  backend: {
    getPort: () => ipcRenderer.invoke('backend:get-port'),
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
  },
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater:check'),
    downloadUpdate: () => ipcRenderer.invoke('updater:download'),
    installUpdate: () => ipcRenderer.invoke('updater:install'),
    getUpdateInfo: () => ipcRenderer.invoke('updater:get-info'),
    onUpdateStatus: (listener: (info: UpdateInfo) => void) => {
      const subscription = (_: Electron.IpcRendererEvent, info: UpdateInfo) => {
        listener(info)
      }

      ipcRenderer.on('update-status', subscription)

      return () => {
        ipcRenderer.removeListener('update-status', subscription)
      }
    }
  }
})

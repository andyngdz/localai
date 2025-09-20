import { contextBridge, ipcRenderer } from 'electron'
import type {
  BackendStatusEmitter,
  BackendStatusPayload
} from '../scripts/backend'

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
  }
})

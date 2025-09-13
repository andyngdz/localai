import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  downloadImage: (url: string) => ipcRenderer.invoke('download-image', url)
})

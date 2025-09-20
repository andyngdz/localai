import { BackendStatusEmitter } from './base'

declare global {
  interface Window {
    electronAPI: {
      downloadImage: (url: string) => Promise<void>
      onBackendSetupStatus: (listener: BackendStatusEmitter) => () => void
    }
  }
}

export {}

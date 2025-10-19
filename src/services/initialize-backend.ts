import { updateSocketUrl } from '@/sockets'
import { client } from './api'

const DEFAULT_PORT = 8000

export const initializeBackend = async () => {
  let port = DEFAULT_PORT

  if (window.electronAPI) {
    port = await window.electronAPI.backend.getPort()
  }

  const baseURL = `http://localhost:${port}`

  client.defaults.baseURL = baseURL

  if (port !== DEFAULT_PORT) {
    updateSocketUrl(baseURL)
  }
}

import { client } from '@/services/api'
import { socket, updateSocketUrl } from '@/sockets'
import { useBackendInitStore } from './states/useBackendInitStore'

const DEFAULT_PORT = 8000

export const initializeBackend = async () => {
  let port = DEFAULT_PORT

  if (globalThis.window.electronAPI) {
    port = await globalThis.window.electronAPI.backend.getPort()
  }

  const baseURL = `http://localhost:${port}`

  client.defaults.baseURL = baseURL

  if (port === DEFAULT_PORT) {
    socket.connect()
  } else {
    updateSocketUrl(baseURL)
  }

  // Signal that backend initialization is complete
  useBackendInitStore.getState().setInitialized(true)
}

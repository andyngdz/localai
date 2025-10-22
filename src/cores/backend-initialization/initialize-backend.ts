import { DEFAULT_BACKEND_PORT } from '@/cores/constants'
import { client } from '@/services/api'
import { socket, updateSocketUrl } from '@/sockets'
import { useBackendInitStore } from './states/useBackendInitStore'

export const initializeBackend = async () => {
  let port = DEFAULT_BACKEND_PORT

  if (globalThis.window.electronAPI) {
    port = await globalThis.window.electronAPI.backend.getPort()
  }

  const baseURL = `http://localhost:${port}`

  client.defaults.baseURL = baseURL
  useBackendInitStore.getState().setBaseURL(baseURL)

  if (port === DEFAULT_BACKEND_PORT) {
    socket.connect()
  } else {
    updateSocketUrl(baseURL)
  }

  // Signal that backend initialization is complete
  useBackendInitStore.getState().setInitialized(true)
}

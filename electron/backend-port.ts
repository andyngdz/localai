import { ipcMain } from 'electron'
import { getBackendPort } from '../scripts/backend'

export const setupBackendPortHandler = () => {
  ipcMain.handle('backend:get-port', () => getBackendPort())
}

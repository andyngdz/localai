import { UpdateInfo } from '@types'
import { BrowserWindow, dialog } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

// Configure logging
autoUpdater.logger = log
log.transports.file.level = 'info'

let mainWindow: BrowserWindow | null = null
let updateInfo: UpdateInfo = { updateAvailable: false }

export function setMainWindow(win: BrowserWindow) {
  mainWindow = win
}

export function getUpdateInfo(): UpdateInfo {
  return updateInfo
}

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
  updateInfo = { updateAvailable: false }
  sendUpdateStatus()
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info.version)
  updateInfo = {
    updateAvailable: true,
    version: info.version,
    downloading: false
  }
  sendUpdateStatus()
})

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info.version)
  updateInfo = { updateAvailable: false }
  sendUpdateStatus()
})

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err)
  updateInfo = {
    updateAvailable: false,
    error: err.message
  }
  sendUpdateStatus()
})

autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Download speed: ${progressObj.bytesPerSecond}`)
  log.info(`Downloaded ${progressObj.percent}%`)
  updateInfo = {
    ...updateInfo,
    downloading: true,
    progress: progressObj.percent
  }
  sendUpdateStatus()
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info.version)
  updateInfo = {
    updateAvailable: true,
    version: info.version,
    downloading: false,
    progress: 100
  }
  sendUpdateStatus()

  // Show dialog to install update
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: `A new version (${info.version}) has been downloaded. Restart to apply the update?`,
      buttons: ['Restart', 'Later']
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
})

function sendUpdateStatus() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-status', updateInfo)
  }
}

export function checkForUpdates() {
  // Only check for updates in production
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdatesAndNotify()
  }
}

export function downloadUpdate() {
  autoUpdater.downloadUpdate()
}

export function installUpdate() {
  autoUpdater.quitAndInstall()
}

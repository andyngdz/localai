import { app, BrowserWindow, ipcMain, shell } from 'electron'
import serve from 'electron-serve'
import path from 'path'
import { startBackend } from '../scripts/backend'
import {
  isLogStreaming,
  startLogStreaming,
  stopLogStreaming
} from './log-streamer'
import {
  checkForUpdates,
  downloadUpdate,
  getUpdateInfo,
  installUpdate,
  setMainWindow
} from './updater'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
process.env.IBUS_USE_PORTAL = '1'

const appDir = app.getAppPath()
const IS_PRODUCTION = app.isPackaged
const DEV_URL = 'http://localhost:3000'
const appServe =
  IS_PRODUCTION && serve({ directory: path.join(appDir, 'dist/renderer') })

const onSetLinuxGpuFlags = () => {
  if (process.platform !== 'linux') return

  app.commandLine.appendSwitch('ignore-gpu-blocklist')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
}

const onCreateWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#0B0B0B',
    webPreferences: {
      preload: path.join(appDir, 'electron', 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      devTools: !IS_PRODUCTION
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  win.once('ready-to-show', () => {
    win.show()

    // Set main window for updater and check for updates
    if (IS_PRODUCTION) {
      setMainWindow(win)
      // Check for updates 5 seconds after window is ready
      setTimeout(() => checkForUpdates(), 5000)
    }
  })

  if (IS_PRODUCTION && appServe) {
    await appServe(win)
  } else {
    const { default: waitOn } = await import('wait-on')
    await waitOn({ resources: [DEV_URL] })

    win.loadURL(DEV_URL)
    win.webContents.openDevTools()
    win.webContents.on('did-fail-load', () => {
      win.webContents.reloadIgnoringCache()
    })
  }
}

const onDownloadImage = () => {
  ipcMain.handle('download-image', async (_, url: string) => {
    const win = BrowserWindow.getFocusedWindow()

    if (win) {
      win.webContents.downloadURL(url)
    }
  })
}

const onLogStreaming = () => {
  ipcMain.handle('backend:start-log-stream', () => {
    startLogStreaming()
  })

  ipcMain.handle('backend:stop-log-stream', () => {
    stopLogStreaming()
  })

  ipcMain.handle('backend:log-stream-status', () => {
    return isLogStreaming()
  })
}

const onAutoUpdate = () => {
  ipcMain.handle('updater:check', () => {
    checkForUpdates()
  })

  ipcMain.handle('updater:download', () => {
    downloadUpdate()
  })

  ipcMain.handle('updater:install', () => {
    installUpdate()
  })

  ipcMain.handle('updater:get-info', () => {
    return getUpdateInfo()
  })
}

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows()

    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(async () => {
    onSetLinuxGpuFlags()

    await onCreateWindow()
    onDownloadImage()
    onLogStreaming()
    onAutoUpdate()

    if (process.env.SKIP_BACKEND !== 'true') {
      startBackend({ userDataPath: app.getPath('userData') })
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

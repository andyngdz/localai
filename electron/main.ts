import { app, BrowserWindow, ipcMain, shell } from 'electron'
import serve from 'electron-serve'
import fixPath from 'fix-path'
import path from 'path'
import { startBackend, stopBackend } from '../scripts/backend'
import { setupBackendPortHandler } from './backend-port'
import { isLogStreaming, startLogStreaming } from './log-streamer'
import {
  broadcastBackendStatus,
  getBackendStatusHistory
} from './status-broadcaster'
import { checkForUpdates, installUpdate, setMainWindow } from './updater'

// This is required to get the correct path in the packaged app
fixPath()

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
    console.log('Development mode: waiting for Next.js server at', DEV_URL)
    const { default: waitOn } = await import('wait-on')

    try {
      await waitOn({ resources: [DEV_URL] })
      console.log('Next.js server is ready')
    } catch (error) {
      console.error('Failed to connect to Next.js server:', error)
      throw error
    }

    console.log('Loading window with URL:', DEV_URL)
    win.loadURL(DEV_URL)
    win.webContents.openDevTools()
    win.webContents.on('did-fail-load', () => {
      console.log('Window failed to load, reloading...')
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
  ipcMain.handle('backend:log-stream-status', () => {
    return isLogStreaming()
  })
}

const onBackendStatusHistory = () => {
  ipcMain.handle('backend-setup:get-history', () => getBackendStatusHistory())
}

const onAppInfo = () => {
  ipcMain.handle('app:get-version', () => app.getVersion())
}

const onAutoUpdate = () => {
  ipcMain.handle('updater:check', () => checkForUpdates())

  ipcMain.handle('updater:install', () => {
    installUpdate()
  })
}

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  console.log('Another instance is already running, exiting...')
  app.quit()
} else {
  console.log('Single instance lock acquired')
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows()

    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(async () => {
    console.log('Electron app ready, initializing...')
    onSetLinuxGpuFlags()

    // Start log streaming early to capture backend initialization logs
    startLogStreaming()

    console.log('Creating main window...')
    await onCreateWindow()
    console.log('Main window created')

    onDownloadImage()
    onLogStreaming()
    onBackendStatusHistory()
    onAppInfo()
    setupBackendPortHandler()
    onAutoUpdate()

    if (process.env.SKIP_BACKEND !== 'true') {
      console.log('Starting Python backend...')
      startBackend({
        userDataPath: app.getPath('userData'),
        externalEmit: broadcastBackendStatus
      })
    } else {
      console.log('Skipping backend startup (SKIP_BACKEND=true)')
    }
  })

  app.on('window-all-closed', () => {
    console.log('All windows closed')
    if (process.platform !== 'darwin') {
      console.log('Quitting app (not macOS)')
      app.quit()
    }
  })

  app.on('before-quit', () => {
    console.log('App is quitting, stopping backend...')
    stopBackend()
  })
}

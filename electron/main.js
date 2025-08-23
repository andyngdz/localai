import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import path from 'path';
import waitOn from 'wait-on';

const __dirname = path.resolve();

const appServe =
  app.isPackaged &&
  serve({
    directory: path.join(__dirname, '../out'),
  });

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
    },
  });

  if (app.isPackaged && appServe) {
    appServe(win).then(() => {
      win.loadURL('app://');
    });
  } else {
    waitOn({ resources: ['http://localhost:3000'] }).then(() => {
      win.loadURL('http://localhost:3000');
      win.webContents.openDevTools();
      win.webContents.on('did-fail-load', () => {
        win.webContents.reloadIgnoringCache();
      });
    });
  }
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

'use strict'

// eslint-disable-next-line standard/object-curly-even-spacing
import { app, BrowserWindow, ipcMain, shell} from 'electron'
import start from './ipc'
import update from './update'
import log from 'electron-log'
const isDev = require('electron-is-dev')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (isDev) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 630,
    useContentSize: true,
    width: 1100,
    minWidth: 1100,
    minHeight: 630,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  if (!isDev) update(mainWindow)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
start()

ipcMain.on('mini', e => mainWindow.minimize())
ipcMain.on('max', e => {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false)
    e.returnValue = {status: 'maximize'}
  } else {
    mainWindow.setFullScreen(true)
    e.returnValue = {status: 'minimize'}
  }
})
ipcMain.on('close', e => mainWindow.close())

ipcMain.on('openWeb', (e, url) => {
  shell.openExternal(url).then(() => {
    log.info('打开网页:' + url)
  })
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

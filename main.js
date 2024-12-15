const { app, BrowserWindow, session } = require('electron')
const path = require('path')
// Force production mode when packaged
const isDev = !app.isPackaged

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 1400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    })

    // Add download handler
    session.defaultSession.on('will-download', (event, item, webContents) => {
        // Get user's downloads directory
        const downloadsPath = app.getPath('downloads')
        
        // Set the save path, forcing Electron to automatically download to the downloads directory
        item.setSavePath(path.join(downloadsPath, item.getFilename()))

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download interrupted')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download paused')
                }
            }
        })

        item.on('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download completed')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        const indexPath = path.join(__dirname, 'dist', 'index.html')
        console.log('Loading from:', indexPath)
        console.log('Current directory:', __dirname)
        console.log('File exists:', require('fs').existsSync(indexPath))
        
        win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('Failed to load:', errorCode, errorDescription);
        });

        win.webContents.on('dom-ready', () => {
            console.log('DOM Ready');
            console.log('Current URL:', win.webContents.getURL());
        });

        // win.webContents.openDevTools()
        win.loadFile(indexPath)
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
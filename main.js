const { app, BrowserWindow, session } = require('electron')
const path = require('path')
// Force production mode when packaged
const isDev = !app.isPackaged

const log = (...args) => {
    if (!app.isPackaged) {  // Only log in development
        console.log(...args);
    }
};

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

    // Enhanced download handler with popup management
    session.defaultSession.on('will-download', (event, item, webContents) => {
        log('Download initiated:', item.getURL());
        
        // Get reference to the popup window that initiated the download
        const popup = BrowserWindow.fromWebContents(webContents);
        
        // Get user's downloads directory
        const downloadsPath = app.getPath('downloads');
        const filename = item.getFilename();
        const savePath = path.join(downloadsPath, filename);
        
        log('Saving to:', savePath);
        item.setSavePath(savePath);

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                log('Download interrupted:', filename);
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    log('Download paused:', filename);
                } else {
                    const percent = item.getReceivedBytes() / item.getTotalBytes() * 100;
                    log(`Download progress: ${Math.round(percent)}%`);
                }
            }
        });

        item.on('done', (event, state) => {
            if (state === 'completed') {
                log('Download completed:', filename);
                // Notify the renderer process
                webContents.send('download-completed', {
                    filename,
                    path: savePath
                });
            } else {
                log(`Download failed: ${state}`, filename);
            }

            // Close the popup window if it exists and isn't destroyed
            if (popup && !popup.isDestroyed()) {
                log('Closing popup window...');
                popup.close();
            }
        });
    });

    // Add request interceptor for PDFs
    session.defaultSession.webRequest.onBeforeRequest(
        { urls: ['*://*/*'] },
        (details, callback) => {
            if (details.url.endsWith('.pdf') || details.url.includes('?__blob=publicationFile')) {
                log('Intercepted PDF request:', details.url);
            }
            callback({});
        }
    );

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
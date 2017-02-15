const electron = require('electron')

const {app, BrowserWindow} = electron


app.on('ready', () => {
    let win = new BrowserWindow({width: 720, height: 720})
    win.loadURL(`file://${__dirname}/app/index.html`)
    win.webContents.openDevTools()
})
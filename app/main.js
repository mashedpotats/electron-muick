/**
 * Created by samuel on 10/10/16.
 */

const electron = require('electron');
const path = require('path');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

var mainWindow;

var pwd = "file://" + __dirname + "/";

console.log(__dirname);
// app.dock.setIcon(appIcon);

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: path.join(__dirname, "build/icon.png")
    });

    mainWindow.setMinimumSize(300, 400);
    mainWindow.loadURL(pwd + "index.html");

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
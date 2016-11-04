/**
 * Created by samuel on 10/10/16.
 */

const electron = require('electron');

const app = electron.app;
const nativeImage = electron.nativeImage;
var appIcon = nativeImage.createFromPath(__dirname + "/icon.png");

const BrowserWindow = electron.BrowserWindow;

var mainWindow;

var pwd = "file://" + __dirname + "/";

console.log(__dirname);
// app.dock.setIcon(appIcon);

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: __dirname + "/icon.png"
    });

    mainWindow.setMinimumSize(300, 400);
    mainWindow.loadURL(pwd + "app/index.html");

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
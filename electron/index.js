'use strict';

const electron = require('electron');
const path = require('path');
const fs = require('fs');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function injectPlugins() {
  mainWindow.webContents.executeJavaScript('window.userFuncs = {};');
  var plugins = fs.readdirSync('plugins').filter(function(name) {
    return name.endsWith('.js');
  }).forEach(function(plugin) {
    var code = fs.readFileSync(path.join('plugins', plugin), 'utf8');
    mainWindow.webContents.executeJavaScript(`;(function(){${code}})();`);
  });
}

function createWindow () {
  let iconPath = __dirname + '/build/glitch192x192.png';
  mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    icon: iconPath,
    backgroundColor: '#333333',
  });

  injectPlugins();
  mainWindow.loadURL('file://' + __dirname + '/build/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

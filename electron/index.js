'use strict';

const electron = require('electron');
const path = require('path');
const fs = require('fs');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function injectPlugins() {
  mainWindow.webContents.executeJavaScript('window.userFuncs = {};');
  try {
    var plugins = fs.readdirSync('plugins').filter(function(name) {
      return name.endsWith('.js');
    }).forEach(function(plugin) {
      var code = fs.readFileSync(path.join('plugins', plugin), 'utf8');
      mainWindow.webContents.executeJavaScript(`;(function(){${code}})();`);
    });
  } catch (e) {}
}

function injectSamples() {
  mainWindow.webContents.executeJavaScript(loadSamples.toString());
  try {
    fs.readdirSync('samples').forEach(function(sample) {
      var wavPath = path.join('samples', sample);
      if (sample.endsWith('.wav')) {
        var name = JSON.stringify(sample.replace(/\.wav$/, ''));
        mainWindow.webContents.executeJavaScript(`loadSamples(${name}, [${JSON.stringify(wavPath)}]);`);
      } else {
        var name = JSON.stringify(sample);
        var variants = fs.readdirSync(wavPath).map(function(f) {
          return path.join(wavPath, f);
        });
        mainWindow.webContents.executeJavaScript(`loadSamples(${name}, ${JSON.stringify(variants)});`);
      }
    });
  } catch (e) {}
}

function loadSamples(name, paths) {
  var fs = require('electron').remote.require('fs');
  window.userFuncs[name] = function(args) {
    this.cache = this.cache || {};
    var index = (args[0] ? args[0]() : 0);
    var volume = (args[1] ? args[1]() : 1);
    let len = paths.length;
    if (!isNaN(index) && !isNaN(volume)) {
      let sample = paths[(((index|0)%len)+len)%len];
      this.cache[sample] = this.cache[sample] || fs.readFileSync(sample);
      if (this.i * 2 + 0x80 + 1 < this.cache[sample].length) {
        let v = this.cache[sample].readInt16LE(0x80 + this.i * 2);
        let x =  v / 0x7fff;
        this.i++;
        return x * volume * 127 + 128;
      } else {
        return NaN
      }
    }
    this.i = 0;
    return NaN
  };
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
  injectSamples();
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

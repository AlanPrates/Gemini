'use strict';

const { BrowserWindow, nativeTheme, ipcMain, shell } = require('electron');
const path = require('path');
const { getPlatform } = require('../shared/utils');

let mainWindow = null;

function createMainWindow(store) {
    const platform = getPlatform();
    const isDark = nativeTheme.shouldUseDarkColors;
    const savedOpacity = store ? store.get('windowOpacity', 1.0) : 1.0;

    const windowOptions = {
        width: 1100,
        height: 720,
        minWidth: 820,
        minHeight: 600,
        show: false,                          // show after ready-to-show
        opacity: savedOpacity,
        backgroundColor: isDark ? '#1c1c1e' : '#f2f2f7',
        titleBarStyle: platform === 'macos' ? 'hiddenInset' : 'hidden',
        trafficLightPosition: { x: 18, y: 18 },
        webPreferences: {
            preload: path.join(__dirname, '../renderer/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,                     // needs false for webviewTag
            webviewTag: true,
            spellcheck: true,
        },
    };

    // Platform-specific visual effects
    if (platform === 'macos') {
        windowOptions.vibrancy = 'sidebar';
        windowOptions.transparent = false;
    } else if (platform === 'windows') {
        windowOptions.frame = false;
        // backgroundMaterial requires Electron 22+ on Win11
        try {
            windowOptions.backgroundMaterial = 'acrylic';
        } catch (_) { /* older Electron — ignore */ }
    } else {
        windowOptions.frame = false;
    }

    mainWindow = new BrowserWindow(windowOptions);

    // Show window once content is ready (no white flash)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Push system theme changes to renderer
    nativeTheme.on('updated', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('theme-changed', {
                isDark: nativeTheme.shouldUseDarkColors,
            });
        }
    });

    // Open external links in the default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https://')) shell.openExternal(url);
        return { action: 'deny' };
    });

    // Minimise to tray on close instead of quitting
    mainWindow.on('close', (event) => {
        if (!mainWindow._isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // IPC: opacity change from settings panel
    ipcMain.on('set-opacity', (_event, value) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.setOpacity(Math.max(0.3, Math.min(1.0, value)));
            if (store) store.set('windowOpacity', value);
        }
    });

    return mainWindow;
}

function getMainWindow() {
    return mainWindow;
}

module.exports = { createMainWindow, getMainWindow };

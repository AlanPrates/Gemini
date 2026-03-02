'use strict';

const { app, ipcMain, globalShortcut, nativeTheme } = require('electron');
const path = require('path');

// Handle Squirrel events on Windows (must be at top)
if (require('electron-squirrel-startup')) app.quit();

// Enforce single instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
}

const { createMainWindow, getMainWindow } = require('./window');
const { createTray } = require('./tray');
const { buildMenu } = require('./menu');
const { showWelcomeNotification } = require('./notifications');
const { DEFAULT_CONFIG } = require('../shared/config');
const { getPlatform } = require('../shared/utils');

// Lazy-require electron-store (optional dep, graceful fallback)
let Store;
let store;
try {
    Store = require('electron-store');
    store = new Store({ defaults: DEFAULT_CONFIG });
} catch (_) {
    // electron-store not installed — use in-memory object
    store = {
        _data: { ...DEFAULT_CONFIG },
        get: (key, fallback) => store._data[key] ?? fallback,
        set: (key, value) => { store._data[key] = value; },
    };
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
    const win = createMainWindow(store);
    buildMenu(win);
    createTray(win);
    showWelcomeNotification(store);
    registerGlobalShortcuts(win, store);

    app.on('activate', () => {
        // macOS: re-show when clicking dock icon
        if (win && !win.isDestroyed()) {
            win.show();
        }
    });
});

app.on('window-all-closed', () => {
    // On macOS keep app running in tray
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('second-instance', () => {
    const win = getMainWindow();
    if (win) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// ─── Global Shortcuts ─────────────────────────────────────────────────────────

function registerGlobalShortcuts(win, store) {
    const toggleShortcut =
        store.get('shortcuts.toggleWindow') || DEFAULT_CONFIG.shortcuts.toggleWindow;

    globalShortcut.register(toggleShortcut, () => {
        if (!win || win.isDestroyed()) return;
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();
        }
    });
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

// Settings: read
ipcMain.handle('get-settings', () => store.get(''));

// Settings: write
ipcMain.on('save-settings', (_event, settings) => {
    Object.entries(settings).forEach(([key, value]) => store.set(key, value));
});

// Platform info query from renderer
ipcMain.handle('get-platform-info', () => ({
    platform: getPlatform(),
    isDark: nativeTheme.shouldUseDarkColors,
    versions: {
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome,
    },
}));

// Window controls (used by Windows 11 custom caption buttons)
ipcMain.on('window-minimize', () => getMainWindow()?.minimize());
ipcMain.on('window-maximize', () => {
    const win = getMainWindow();
    if (win) {
        win.isMaximized() ? win.unmaximize() : win.maximize();
    }
});
ipcMain.on('window-close', () => getMainWindow()?.hide());

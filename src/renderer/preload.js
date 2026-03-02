'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * Safe IPC bridge exposed to the renderer as window.electronAPI.
 * No Node.js APIs are exposed directly — only whitelisted channels.
 */
contextBridge.exposeInMainWorld('electronAPI', {
    // Platform identification
    getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.send('save-settings', settings),
    setOpacity: (value) => ipcRenderer.send('set-opacity', value),

    // Window controls
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    maximizeWindow: () => ipcRenderer.send('window-maximize'),
    closeWindow: () => ipcRenderer.send('window-close'),

    // Listen for events from main
    onThemeChanged: (callback) => {
        ipcRenderer.on('theme-changed', (_event, data) => callback(data));
    },
    onNewConversation: (callback) => {
        ipcRenderer.on('new-conversation', () => callback());
    },
});

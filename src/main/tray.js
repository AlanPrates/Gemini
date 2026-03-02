'use strict';

const { Tray, Menu, app } = require('electron');
const path = require('path');

let tray = null;

/**
 * Creates the system tray icon and its context menu.
 * @param {BrowserWindow} win - The main application window
 */
function createTray(win) {
    const iconPath = path.join(__dirname, '../../assets/icons/icon-tray.png');
    tray = new Tray(iconPath);

    tray.setToolTip('Gemini');

    const buildContextMenu = () =>
        Menu.buildFromTemplate([
            {
                label: 'Abrir Gemini',
                click: () => {
                    if (win && !win.isDestroyed()) {
                        win.show();
                        win.focus();
                    }
                },
            },
            { type: 'separator' },
            {
                label: 'Sair',
                click: () => {
                    win._isQuitting = true;
                    app.quit();
                },
            },
        ]);

    tray.setContextMenu(buildContextMenu());

    // Single click on tray: toggle window visibility
    tray.on('click', () => {
        if (!win || win.isDestroyed()) return;
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
            win.focus();
        }
    });

    return tray;
}

function getTray() {
    return tray;
}

module.exports = { createTray, getTray };

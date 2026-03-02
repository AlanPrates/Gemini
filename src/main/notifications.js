'use strict';

const { Notification, app } = require('electron');

/**
 * Show a generic notification.
 * @param {string} title
 * @param {string} body
 */
function showNotification(title, body) {
    if (Notification.isSupported()) {
        new Notification({ title, body }).show();
    }
}

/**
 * Shows a one-time welcome notification on first launch.
 * @param {import('electron-store')} store
 */
function showWelcomeNotification(store) {
    const hasShownWelcome = store.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        setTimeout(() => {
            showNotification(
                'Bem-vindo ao Gemini!',
                'O app está rodando na barra de menus. Clique no ícone para abrir.'
            );
            store.set('hasShownWelcome', true);
        }, 3000);
    }
}

module.exports = { showNotification, showWelcomeNotification };

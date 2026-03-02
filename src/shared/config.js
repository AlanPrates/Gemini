'use strict';

/**
 * Default application configuration.
 * Read by both the main process (electron-store defaults)
 * and the renderer (to initialise the settings panel).
 */
const DEFAULT_CONFIG = {
    theme: 'system',        // 'light' | 'dark' | 'system'
    fontSize: 16,           // px
    windowOpacity: 1.0,     // 0.5 – 1.0
    launchAtStartup: false,
    showInTray: true,
    notificationsEnabled: true,
    shortcuts: {
        toggleWindow: 'CommandOrControl+Shift+G',
        newConversation: 'CommandOrControl+N',
        openSettings: 'CommandOrControl+,',
        reloadWebview: 'CommandOrControl+R',
    },
};

module.exports = { DEFAULT_CONFIG };

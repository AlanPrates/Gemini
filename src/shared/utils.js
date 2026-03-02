'use strict';

/**
 * Returns the current platform identifier used throughout the app.
 * @returns {'macos'|'windows'|'linux'}
 */
function getPlatform() {
    switch (process.platform) {
        case 'darwin': return 'macos';
        case 'win32': return 'windows';
        default: return 'linux';
    }
}

/**
 * Returns true when running in development mode (not packaged).
 */
function isDev() {
    return !require('electron').app.isPackaged;
}

module.exports = { getPlatform, isDev };

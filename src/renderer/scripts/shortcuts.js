'use strict';

/**
 * shortcuts.js — Renderer-side keyboard shortcuts
 * settings.js must be loaded first; openSettings/closeSettings
 * are exposed on window by that script.
 */

document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl + , → Open settings
    if (mod && e.key === ',') {
        e.preventDefault();
        window.openSettings();
        return;
    }

    // Escape → Close settings panel if open
    if (e.key === 'Escape') {
        const panel = document.getElementById('settings-panel');
        if (panel?.classList.contains('open')) {
            e.preventDefault();
            window.closeSettings();
        }
    }

    // Cmd/Ctrl + R → Reload webview
    if (mod && e.key === 'r') {
        e.preventDefault();
        const webview = document.getElementById('gemini-webview');
        webview?.reload();
    }

    // Cmd/Ctrl + N → New conversation (navigate webview)
    if (mod && e.key === 'n') {
        e.preventDefault();
        const webview = document.getElementById('gemini-webview');
        if (webview) webview.src = 'https://gemini.google.com/app';
    }
});

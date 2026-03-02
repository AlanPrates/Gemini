'use strict';

/**
 * app.js — Renderer main logic
 * Runs in the browser context via a <script type="module"> tag.
 */

const api = window.electronAPI;

// ─── Platform detection ───────────────────────────────────────────────────────

async function init() {
    const info = await api.getPlatformInfo();
    const { platform, isDark } = info;

    // Set platform class on <body> for CSS targeting
    document.body.classList.add(platform);   // 'macos' | 'windows' | 'linux'
    if (isDark) document.body.classList.add('dark');

    // Show Windows caption buttons only on Windows
    if (platform === 'windows') {
        document.getElementById('win-controls').style.display = 'flex';
        document.getElementById('btn-settings').style.display = 'none'; // Hide settings icon on Windows
    }

    initWebview();
    initThemeListener();
    initWindowControls();
}

// ─── Webview setup ───────────────────────────────────────────────────────────

function initWebview() {
    const webview = document.getElementById('gemini-webview');
    if (!webview) return;

    webview.addEventListener('dom-ready', () => {
        // Inject CSS to clean up the Gemini UI
        webview.insertCSS(`
      /* Hide redundant banners and capability cards */
      .text-xs.text-center,
      .sticky,
      .pointer-events-auto.flex.border-orange-500,
      [class*="shared__Capabilities"] {
        display: none !important;
      }
      [class*="shared__Wrapper"] {
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-top: 12vh;
      }
    `);
    });

    webview.addEventListener('page-title-updated', (e) => {
        const title = document.getElementById('title-text');
        if (title) title.textContent = e.title || 'Gemini';
    });
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function initThemeListener() {
    api.onThemeChanged(({ isDark }) => {
        document.body.classList.toggle('dark', isDark);
    });
}

// ─── New conversation ─────────────────────────────────────────────────────────

api.onNewConversation(() => {
    const webview = document.getElementById('gemini-webview');
    if (webview) {
        webview.src = 'https://gemini.google.com/app';
    }
});

// ─── Window controls (Windows) ───────────────────────────────────────────────

function initWindowControls() {
    document.getElementById('btn-win-min')?.addEventListener('click', () =>
        api.minimizeWindow()
    );
    document.getElementById('btn-win-max')?.addEventListener('click', () =>
        api.maximizeWindow()
    );
    document.getElementById('btn-win-close')?.addEventListener('click', () =>
        api.closeWindow()
    );
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();

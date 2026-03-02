'use strict';

/**
 * settings.js — Settings panel UI interactions
 * Loaded as a regular script (no bundler), exposes helpers via window.
 */

const api = window.electronAPI;
const panel = document.getElementById('settings-panel');
const backdrop = document.getElementById('settings-backdrop');

// ─── Open / Close ─────────────────────────────────────────────────────────────

window.openSettings = function () {
    panel.classList.add('open');
};

window.closeSettings = function () {
    panel.classList.remove('open');
};

backdrop?.addEventListener('click', closeSettings);
document.getElementById('btn-close-settings')?.addEventListener('click', closeSettings);
document.getElementById('btn-settings')?.addEventListener('click', openSettings);

// ─── Load saved settings ──────────────────────────────────────────────────────

async function loadSettings() {
    const settings = await api.getSettings();
    if (!settings) return;

    // Theme
    const theme = settings.theme || 'system';
    document
        .querySelectorAll('.theme-btn')
        .forEach((btn) => btn.classList.toggle('active', btn.dataset.theme === theme));

    // Opacity
    const opacitySlider = document.getElementById('slider-opacity');
    const opacityLabel = document.getElementById('label-opacity');
    if (opacitySlider && settings.windowOpacity) {
        opacitySlider.value = settings.windowOpacity;
        if (opacityLabel) opacityLabel.textContent = Math.round(settings.windowOpacity * 100) + '%';
    }
}

// ─── Theme buttons ─────────────────────────────────────────────────────────────

document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else if (theme === 'light') {
            document.body.classList.remove('dark');
        }
        // 'system' handled by OS event in app.js

        api.saveSettings({ theme });
    });
});

// ─── Opacity slider ───────────────────────────────────────────────────────────

const opacitySlider = document.getElementById('slider-opacity');
const opacityLabel = document.getElementById('label-opacity');

opacitySlider?.addEventListener('input', () => {
    const val = parseFloat(opacitySlider.value);
    if (opacityLabel) opacityLabel.textContent = Math.round(val * 100) + '%';
    api.setOpacity(val);
    api.saveSettings({ windowOpacity: val });
});

// ─── Init ─────────────────────────────────────────────────────────────────────
loadSettings();

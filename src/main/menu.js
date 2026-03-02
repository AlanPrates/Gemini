'use strict';

const { Menu, app, shell } = require('electron');

/**
 * Builds and sets the native application menu.
 * @param {BrowserWindow} win
 */
function buildMenu(win) {
    const isMac = process.platform === 'darwin';

    const template = [
        // macOS app menu
        ...(isMac
            ? [
                {
                    label: app.name,
                    submenu: [
                        { role: 'about', label: `Sobre ${app.name}` },
                        { type: 'separator' },
                        { role: 'services' },
                        { type: 'separator' },
                        { role: 'hide' },
                        { role: 'hideOthers' },
                        { role: 'unhide' },
                        { type: 'separator' },
                        { role: 'quit' },
                    ],
                },
            ]
            : []),

        {
            label: 'Ações',
            submenu: [
                {
                    label: 'Atualizar Página',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => win?.webContents.reload(),
                },
                {
                    label: 'Nova Conversa',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => win?.webContents.send('new-conversation'),
                },
                { type: 'separator' },
                {
                    label: 'GitHub do Autor',
                    click: () => shell.openExternal('https://github.com/AlanPrates'),
                },
            ],
        },

        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Desfazer' },
                { role: 'redo', label: 'Refazer' },
                { type: 'separator' },
                { role: 'cut', label: 'Recortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Colar' },
                { role: 'selectAll', label: 'Selecionar Tudo' },
            ],
        },

        {
            label: 'Exibir',
            submenu: [
                { role: 'toggleDevTools', label: 'Ferramentas do Desenvolvedor' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom Padrão' },
                { role: 'zoomIn', label: 'Ampliar' },
                { role: 'zoomOut', label: 'Reduzir' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Tela Cheia' },
            ],
        },

        {
            label: 'Janela',
            submenu: [
                { role: 'minimize', label: 'Minimizar' },
                ...(isMac
                    ? [
                        { role: 'zoom' },
                        { type: 'separator' },
                        { role: 'front' },
                    ]
                    : [{ role: 'close', label: 'Fechar' }]),
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

module.exports = { buildMenu };

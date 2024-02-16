const { app, BrowserWindow, Menu, shell, clipboard } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });

  const menuTemplate = [
    {
      label: 'Ações',
      submenu: [
        {
          label: 'Atualizar Página',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Meu GitHub',
          click: () => {
            shell.openExternal('https://github.com/AlanPrates');
          }
        },
        {
          label: 'Editar',
          submenu: [
            {
              label: 'Copiar',
              accelerator: 'CmdOrCtrl+C',
              click: () => mainWindow.webContents.copy()
            },
            {
              label: 'Colar',
              accelerator: 'CmdOrCtrl+V',
              click: () => mainWindow.webContents.paste()
            },
            {
              label: 'Recortar',
              accelerator: 'CmdOrCtrl+X',
              click: () => mainWindow.webContents.cut()
            },
            {
              label: 'Selecionar Tudo',
              accelerator: 'CmdOrCtrl+A',
              click: () => mainWindow.webContents.selectAll()
            }
          ]
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.insertCSS(`

    `);

    mainWindow.webContents.executeJavaScript(`

    `);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

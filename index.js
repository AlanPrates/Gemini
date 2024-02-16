const { app, BrowserWindow, Menu, Tray, shell, clipboard, Notification } = require('electron');
const path = require('path');

let mainWindow;
let appIcon = null;

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
        },
        { type: 'separator' },
        {
          label: 'Minimizar',
          click: () => {
            mainWindow.minimize();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  appIcon = new Tray(path.join(__dirname, 'images/icon-AI.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir Aplicativo',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Sair',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip('Meu App Tray');
  appIcon.setContextMenu(contextMenu);


  setTimeout(() => {
    new Notification({
      title: 'Notificação',
      body: 'Olá! Esta é uma notificação do seu aplicativo.'
    }).show();
  }, 5000); 
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

# 💎 Gemini Desktop


Esse projeto é um aplicativo desktop que eu fiz usando **Electron** pra rodar o [Google Gemini](https://gemini.google.com) como se fosse um app nativo no computador, sem precisar abrir o navegador toda hora.

![Captura do App](images/Captura.png)

> Funciona no **macOS** e no **Windows 11**! No macOS fica com aquele efeito de vidro (vibrancy) e no Windows 11 fica com o estilo Fluent Design do Windows.

---

## 🗂 Como o projeto tá organizado

```
Gemini/
├── src/
│   ├── main/               # Aqui fica o "cérebro" do app (processo principal)
│   │   ├── index.js        # Arquivo principal, onde tudo começa
│   │   ├── window.js       # Cria a janela do app
│   │   ├── tray.js         # Gerencia o ícone na barra de menus/bandeja
│   │   ├── menu.js         # Menu nativo do sistema
│   │   └── notifications.js# Notificações do sistema
│   │
│   ├── renderer/           # Aqui fica a interface visual (o que o usuário vê)
│   │   ├── index.html      # Página principal com a barra de título customizada
│   │   ├── preload.js      # Ponte segura entre a interface e o sistema
│   │   ├── styles/
│   │   │   ├── main.css        # Estilos gerais (cores, fontes, animações)
│   │   │   ├── macos.css       # Estilos específicos pro macOS
│   │   │   └── windows11.css   # Estilos específicos pro Windows 11
│   │   └── scripts/
│   │       ├── app.js          # Lógica principal da interface
│   │       ├── settings.js     # Painel de configurações
│   │       └── shortcuts.js    # Atalhos de teclado
│   │
│   └── shared/             # Coisas que tanto o main quanto o renderer usam
│       ├── config.js       # Configurações padrão do app
│       └── utils.js        # Funções utilitárias
│
├── assets/
│   └── icons/              # Ícones do app
│
├── package.json
└── README.md               # Esse arquivo aqui rsrs
```

---

## 🚀 Como rodar o projeto

Primeiro, precisa ter o **Node.js** instalado. Se não tiver, baixa em [nodejs.org](https://nodejs.org).

**1. Clonar o repositório:**
```bash
git clone https://github.com/AlanPrates/Gemini.git
cd Gemini
```

**2. Instalar as dependências:**
```bash
npm install
```

**3. Rodar em modo desenvolvimento:**
```bash
npm start
```

Pronto! O app vai abrir. 🎉

---

## 📦 Como gerar o instalador

Pra gerar o `.dmg` pro macOS, o `.exe` pro Windows ou o `.deb`/`.rpm` pro Linux:

```bash
# Gera pra todas as plataformas de uma vez
npm run build

# Ou só pra uma plataforma específica:
npm run build:mac      # macOS → gera .dmg
npm run build:win      # Windows → gera .exe
npm run build:linux    # Linux → gera .deb
```

> ⚠️ **Observação importante:** Pra gerar o instalador do Windows em um Mac, precisa ter o **Wine** instalado. Eu aprendi isso na marra. Instala com `brew install --cask wine-stable` se precisar.

Os arquivos gerados vão aparecer na pasta `dist/`.

---

## ⌨️ Atalhos de teclado

Esses atalhos eu achei super úteis no dia a dia:

| Atalho | O que faz |
|---|---|
| `⌘ / Ctrl + Shift + G` | Mostra ou esconde a janela de qualquer lugar |
| `⌘ / Ctrl + ,` | Abre as configurações |
| `⌘ / Ctrl + N` | Começa uma nova conversa |
| `⌘ / Ctrl + R` | Recarrega o app |
| `Esc` | Fecha o painel de configurações |

---

## ⚙️ Configurações

Tem um painel de configurações bem legal (abre com `⌘ + ,`) onde dá pra mudar:

- **Tema:** Claro, Escuro ou Automático (segue o tema do sistema)
- **Opacidade da janela:** Dá pra deixar a janela transparente

As configurações ficam salvas automaticamente mesmo depois de fechar o app.

---

## 🔒 Segurança

Tentei seguir as boas práticas de segurança do Electron que aprendi estudando a documentação:

- `nodeIntegration` tá desativado (evita que o site acesse o sistema)
- `contextIsolation` tá ativado (isola o renderer do processo principal)
- Toda comunicação passa pelo `preload.js` via `contextBridge`
- Tem Content Security Policy configurado no HTML

---

## 🐛 Problemas conhecidos / coisas que ainda quero melhorar

- [ ] O Cross-compilation (gerar .exe num Mac) ainda é chato de configurar
- [ ] Histórico de conversas salvo localmente seria incrível
- [ ] Talvez adicionar suporte a múltiplas abas futuramente

---

## 🙏 Créditos

- Feito com ❤️ por [Alan Prates](https://github.com/AlanPrates)
- Powered by [Google Gemini](https://gemini.google.com) e [Electron](https://electronjs.org)

---

## 📄 Licença

MIT — pode usar, modificar e distribuir à vontade. Só não esquece de dar os créditos! 😄

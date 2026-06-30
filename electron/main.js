const { app, BrowserWindow } = require("electron");

// Linux: evita o crash (SIGSEGV) — desliga GPU e sandbox
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("no-sandbox");

function createWindow() {
  const win = new BrowserWindow({
    width: 420,   // estreito, tipo celular (combina com seu layout max-w-md)
    height: 800,
  });

  // carrega o seu app que está rodando no Next
  win.loadURL("http://localhost:3000");
}

// quando o Electron estiver pronto, abre a janela
app.whenReady().then(() => {
  createWindow();

  // no Mac, reabre a janela se clicar no ícone do dock
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// fecha o app quando todas as janelas fecharem (exceto no Mac)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  globalShortcut,
} = require("electron");
const path = require("path");

let win;
let examHotkeysEnabled = true;

function enterExamMode() {
  if (!win) return;
  win.setKiosk(true);
  win.setFullScreen(true);
  win.setAlwaysOnTop(true, "screen-saver");
  win.show();
  win.focus();

  setTimeout(() => {
    if (!win) return;
    win.setFullScreen(true);
    win.focus();
  }, 50);
}

function exitExamMode() {
  if (!win) return;
  win.setAlwaysOnTop(false);
  win.setKiosk(false);
  win.setFullScreen(false);

  setTimeout(() => {
    if (!win) return;
    win.setFullScreen(false);
  }, 50);

  win.focus();
}

function registerHotkeys() {
  globalShortcut.unregisterAll();

  const ok1 = globalShortcut.register("Alt+Shift+P", () => {
    if (!examHotkeysEnabled) return;
    exitExamMode();
  });

  const ok2 = globalShortcut.register("Alt+Shift+O", () => {
    if (!examHotkeysEnabled) return;
    enterExamMode();
  });

  console.log("Hotkeys registered:", { ok1, ok2 });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    kiosk: false,
    fullscreen: false,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "..", "dist", "index.html"));

  ipcMain.handle("exam:enter", async () => {
    if (!win) return false;
    enterExamMode();
    return true;
  });

  ipcMain.handle("exam:exit", async () => {
    if (!win) return false;
    exitExamMode();
    return true;
  });

  ipcMain.handle("exam:hotkeys", (e, enabled) => {
    examHotkeysEnabled = !!enabled;
    return examHotkeysEnabled;
  });

  ipcMain.handle("ui:info", async (e, message) => {
    if (!win) return true;
    await dialog.showMessageBox(win, {
      type: "info",
      buttons: ["OK"],
      title: "Examin",
      message: message || "Xabar",
    });
    return true;
  });

  ipcMain.handle("ui:alert", async (event, { title, message }) => {
    if (!win) return true;
    await dialog.showMessageBox(win, {
      type: "info",
      title: title || "Xabar",
      message: String(message ?? ""),
      buttons: ["OK"],
      defaultId: 0,
    });
    return true;
  });

  ipcMain.handle("ui:confirm", async (event, { title, message }) => {
    if (!win) return false;
    const res = await dialog.showMessageBox(win, {
      type: "question",
      title: title || "Tasdiqlang",
      message: String(message ?? ""),
      buttons: ["OK", "Cancel"],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });
    return res.response === 0;
  });
}

app.whenReady().then(() => {
  createWindow();
  registerHotkeys();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

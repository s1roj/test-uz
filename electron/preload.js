const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("examApp", {
  enterExamMode: () => ipcRenderer.invoke("exam:enter"),
  exitExamMode: () => ipcRenderer.invoke("exam:exit"),
  info: (msg) => ipcRenderer.invoke("ui:info", msg),

  alert: (message, title) => ipcRenderer.invoke("ui:alert", { message, title }),
  confirm: (message, title) =>
    ipcRenderer.invoke("ui:confirm", { message, title }), 
});

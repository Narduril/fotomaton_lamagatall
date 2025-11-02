const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
  savePhoto: (base64Data, filename) =>
    ipcRenderer.invoke('save-photo', base64Data, filename),
});
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => ipcRenderer.invoke('agent-chat', message),
    onUpdate: (callback) => {
        const listener = (_event, update) => callback(update);
        ipcRenderer.on('agent-update', listener);
        return () => ipcRenderer.removeListener('agent-update', listener);
    },
});

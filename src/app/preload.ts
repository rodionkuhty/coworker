import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.invoke('agent-chat', message),
  onUpdate: (callback: (update: string) => void) => {
    const listener = (_event: any, update: string) => callback(update);
    ipcRenderer.on('agent-update', listener);
    return () => ipcRenderer.removeListener('agent-update', listener);
  },
  platform: process.platform,
});

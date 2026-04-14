import { contextBridge, ipcRenderer } from 'electron';

const validChannels = ['sync:push', 'sync:pull', 'entry:list', 'entry:upsert'];

contextBridge.exposeInMainWorld('electronAPI', {
  getPlatform: () => process.platform,
  getVersion: () => '1.0.0',

  invoke: (channel: string, ...args: unknown[]) => {
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    throw new Error(`Invalid channel: ${channel}`);
  },

  onSyncProgress: (callback: (data: unknown) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: unknown) =>
      callback(data);
    ipcRenderer.on('sync-progress', subscription);
    return () => ipcRenderer.removeListener('sync-progress', subscription);
  },
});

declare global {
  interface Window {
    electronAPI: {
      getPlatform: () => string;
      getVersion: () => string;
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
      onSyncProgress: (callback: (data: unknown) => void) => () => void;
    };
  }
}

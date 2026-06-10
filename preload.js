const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal:      (url)                    => ipcRenderer.invoke('open-external', url),
  savePdf:           (html, name)             => ipcRenderer.invoke('save-pdf', html, name),
  getSavedPaths:     ()                       => ipcRenderer.invoke('get-saved-paths'),
  savePaths:         (data)                   => ipcRenderer.invoke('save-paths', data),
  pickFolder:        ()                       => ipcRenderer.invoke('pick-folder'),
  readJson:          (folder, file)           => ipcRenderer.invoke('read-json', folder, file),
  writeJson:         (folder, file, data)     => ipcRenderer.invoke('write-json', folder, file, data),
  getFileMtime:      (folder, file)           => ipcRenderer.invoke('get-file-mtime', folder, file),
  readAttachment:    (folder, file)           => ipcRenderer.invoke('read-attachment', folder, file),
  writeAttachment:   (folder, file, b64)      => ipcRenderer.invoke('write-attachment', folder, file, b64),
  removeAttachment:  (folder, file)           => ipcRenderer.invoke('remove-attachment', folder, file),
});

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

// Persistent config stored in userData (survives localStorage clears and reinstalls)
const configPath = () => path.join(app.getPath('userData'), 'folio-paths.json');

async function readPaths() {
  try { return JSON.parse(await fs.readFile(configPath(), 'utf8')); } catch { return {}; }
}
async function writePaths(data) {
  try { await fs.writeFile(configPath(), JSON.stringify(data, null, 2), 'utf8'); } catch {}
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 640,
    minHeight: 480,
    title: 'Folio',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });
  mainWindow.loadFile('notes.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-saved-paths', async () => readPaths());

ipcMain.handle('save-paths', async (_, data) => { await writePaths(data); });

ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Folio Data Folder',
  });
  if (result.canceled || !result.filePaths.length) return null;
  return result.filePaths[0];
});

ipcMain.handle('read-json', async (_, folderPath, filename) => {
  try {
    const content = await fs.readFile(path.join(folderPath, filename), 'utf8');
    return JSON.parse(content);
  } catch { return null; }
});

ipcMain.handle('write-json', async (_, folderPath, filename, data) => {
  try {
    await fs.writeFile(path.join(folderPath, filename), JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) { console.error('write-json:', e); return false; }
});

ipcMain.handle('get-file-mtime', async (_, folderPath, filename) => {
  try {
    const stat = await fs.stat(path.join(folderPath, filename));
    return stat.mtimeMs;
  } catch { return 0; }
});

ipcMain.handle('read-attachment', async (_, folderPath, filename) => {
  try {
    const buf = await fs.readFile(path.join(folderPath, filename));
    return buf.toString('base64');
  } catch { return null; }
});

ipcMain.handle('write-attachment', async (_, folderPath, filename, base64) => {
  try {
    await fs.writeFile(path.join(folderPath, filename), Buffer.from(base64, 'base64'));
    return true;
  } catch { return false; }
});

ipcMain.handle('remove-attachment', async (_, folderPath, filename) => {
  try { await fs.unlink(path.join(folderPath, filename)); return true; }
  catch { return false; }
});

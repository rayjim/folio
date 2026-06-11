const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron');
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
    show: false,           // hide until ready-to-show to prevent white/black flash
    backgroundColor: '#1a1a1a', // match dark-theme bg so flash is invisible
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
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

ipcMain.handle('open-external', async (_, url) => { await shell.openExternal(url); });

ipcMain.handle('copy-html', async (_, html) => {
  // Write HTML (for rich-text paste in email clients) + plain text fallback
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
  clipboard.write({ html, text: plain });
});

ipcMain.handle('save-pdf', async (_, htmlContent, defaultName) => {
  const tmpPath = path.join(app.getPath('temp'), 'folio-pdf-tmp.html');
  const pdfWin = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: true } });
  try {
    await fs.writeFile(tmpPath, htmlContent, 'utf8');
    await pdfWin.loadFile(tmpPath);
    const pdfData = await pdfWin.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
    pdfWin.close();
    await fs.unlink(tmpPath).catch(() => {});
    const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow() || mainWindow, {
      defaultPath: (defaultName || 'export') + '.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (!canceled && filePath) { await fs.writeFile(filePath, pdfData); return true; }
    return false;
  } catch (e) {
    pdfWin.close();
    await fs.unlink(tmpPath).catch(() => {});
    console.error('save-pdf:', e);
    return false;
  }
});

ipcMain.handle('get-saved-paths', async () => readPaths());

ipcMain.handle('save-paths', async (_, data) => { await writePaths(data); });

ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow() || mainWindow, {
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

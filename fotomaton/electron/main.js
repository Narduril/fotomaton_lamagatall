import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173/#/home');
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'), { hash: '/home' });
  }
}

ipcMain.handle('save-photo', async (event, base64Data, filename) => {
  try {
    const picturesDir = join(os.homedir(), 'Pictures', 'Fotomaton');
    if (!fs.existsSync(picturesDir)) {
      fs.mkdirSync(picturesDir, { recursive: true });
    }

    const filePath = join(picturesDir, filename);
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, data, 'base64');

    return { success: true, path: filePath };
  } catch (error) {
    console.error('❌ Error guardando foto:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow);
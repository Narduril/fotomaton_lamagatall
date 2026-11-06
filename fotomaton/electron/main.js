import { app, BrowserWindow, ipcMain } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { getSaveErrorMessage, getStoredPhotos, getTodayFolderName, resolvePhotoDirectory } from './photo-storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPhotosRoot = () => {
  const picturesPath = app.getPath('pictures');

  if (picturesPath && picturesPath.trim().length > 0) {
    return picturesPath;
  }

  return path.join(os.homedir(), 'Pictures');
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const distIndexPath = join(__dirname, '..', 'dist', 'index.html');

  if (fs.existsSync(distIndexPath)) {
    mainWindow.loadURL(`file://${distIndexPath}#/home`);
    return;
  }

  mainWindow.loadURL('http://localhost:5173/#/home').catch(() => {
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <html>
        <body style="font-family:sans-serif;display:grid;place-items:center;height:100vh;margin:0;background:#111;color:#fff;">
          <div>
            <h2>Fotomaton</h2>
            <p>Build no encontrado. Ejecuta <strong>pnpm run build</strong> o <strong>pnpm run dev</strong>.</p>
          </div>
        </body>
      </html>
    `));
  });
}

ipcMain.handle('save-photo', async (event, base64Data, filename) => {
  try {
    const targetDir = resolvePhotoDirectory(getPhotosRoot(), getTodayFolderName());
    const safeFilename = typeof filename === 'string' && filename.trim().length > 0 ? filename : `photo_${Date.now()}.jpeg`;
    const filePath = join(targetDir, safeFilename);
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');

    fs.writeFileSync(filePath, data, 'base64');

    return { success: true, path: filePath };
  } catch (error) {
    const friendlyError = getSaveErrorMessage(error, 'No se pudo guardar la foto. Comprueba que la carpeta de destino esté disponible y tengas permisos de escritura.');
    console.error('❌ Error guardando foto:', friendlyError);
    return { success: false, error: friendlyError };
  }
});

ipcMain.handle('get-photos', async () => {
  try {
    return getStoredPhotos(getPhotosRoot());
  } catch (error) {
    console.error('❌ Error recuperando fotos:', error);
    return [];
  }
});

app.whenReady().then(createWindow);
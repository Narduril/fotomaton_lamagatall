import { app, BrowserWindow, ipcMain } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPhotosRoot = () => {
  const picturesPath = app.getPath('pictures');

  if (picturesPath && picturesPath.trim().length > 0) {
    return join(picturesPath, 'Fotomaton');
  }

  const fallbackRoot = join(os.homedir(), 'Pictures', 'Fotomaton');
  return fallbackRoot;
};

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

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const folderName = `${yyyy}-${mm}-${dd}`;

const photosRoot = getPhotosRoot();
const photosDir = join(photosRoot, folderName);

if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

const getStoredPhotos = () => {
  if (!fs.existsSync(photosRoot)) {
    return [];
  }

  const dateDirectories = fs.readdirSync(photosRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a));

  const files = dateDirectories.flatMap((dateFolder) => {
    const folderPath = join(photosRoot, dateFolder);

    if (!fs.existsSync(folderPath)) {
      return [];
    }

    return fs.readdirSync(folderPath)
      .filter((fileName) => /\.(jpe?g|png|webp|gif|bmp)$/i.test(fileName))
      .map((fileName) => join(folderPath, fileName));
  });

  return files.sort((a, b) => b.localeCompare(a));
};

ipcMain.handle('save-photo', async (event, base64Data, filename) => {
  try {
    const targetDir = join(getPhotosRoot(), folderName);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = join(targetDir, filename);
    const data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, data, 'base64');

    return { success: true, path: filePath };
  } catch (error) {
    console.error('❌ Error guardando foto:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-photos', async () => {
  try {
    return getStoredPhotos();
  } catch (error) {
    console.error('❌ Error recuperando fotos:', error);
    return [];
  }
});

app.whenReady().then(createWindow);
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const getTodayFolderName = (date = new Date()) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const sanitizePath = (value) => {
  if (typeof value !== 'string') {
    return String(value ?? '');
  }

  return value
    .replace(/(?:[A-Za-z]:)?[\\/]+(?:Users|home|users|HOME)[\\/][^\r\n]+/gi, '[ruta-oculta]')
    .replace(/(?:[A-Za-z]:)?[\\/]+(?:Pictures|Documents|Desktop|Downloads)[\\/][^\r\n]+/gi, '[ruta-oculta]');
};

export const getCandidatePhotoRoots = (preferredRoot) => {
  const homeDir = os.homedir();
  const userProfile = process.env.USERPROFILE || homeDir;
  const windowsPictureRoots = [
    path.join(userProfile, 'Pictures'),
    path.join(userProfile, 'OneDrive', 'Pictures'),
    path.join(userProfile, 'OneDrive - Personal', 'Pictures'),
    path.join(userProfile, 'Documents', 'Pictures'),
    path.join(homeDir, 'Pictures'),
    path.join(homeDir, 'Documents', 'Pictures'),
  ];

  const candidates = [
    preferredRoot,
    ...windowsPictureRoots,
    os.tmpdir(),
  ].filter(Boolean);

  const uniqueCandidates = [];
  const seen = new Set();

  for (const candidate of candidates) {
    const normalized = path.resolve(candidate);
    if (!seen.has(normalized)) {
      uniqueCandidates.push(candidate);
      seen.add(normalized);
    }
  }

  return uniqueCandidates;
};

export const ensureDirectoryWritable = (directoryPath) => {
  const normalizedDir = path.resolve(directoryPath);
  const probePath = path.join(normalizedDir, `.fotomaton-write-test-${randomUUID()}`);

  try {
    fs.mkdirSync(normalizedDir, { recursive: true });
    fs.accessSync(normalizedDir, fs.constants.W_OK);

    fs.writeFileSync(probePath, 'ok', { flag: 'wx' });
    fs.unlinkSync(probePath);

    return normalizedDir;
  } catch (error) {
    try {
      if (fs.existsSync(probePath)) {
        fs.unlinkSync(probePath);
      }
    } catch {
      // no-op: the directory is already invalid; report the original error
    }

    throw error;
  }
};

export const resolvePhotoDirectory = (preferredRoot, dateFolderName = getTodayFolderName()) => {
  const candidateRoots = getCandidatePhotoRoots(preferredRoot);
  let lastError;

  for (const root of candidateRoots) {
    const fullTargetDir = path.join(root, 'Fotomaton', dateFolderName);

    try {
      ensureDirectoryWritable(fullTargetDir);
      return fullTargetDir;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('No hay una carpeta disponible para guardar fotos.');
};

export const getStoredPhotos = (preferredRoot) => {
  const photos = new Set();

  for (const root of getCandidatePhotoRoots(preferredRoot)) {
    const photosRoot = path.join(root, 'Fotomaton');
    if (!fs.existsSync(photosRoot)) {
      continue;
    }

    const dateDirectories = fs.readdirSync(photosRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const dateFolder of dateDirectories) {
      const folderPath = path.join(photosRoot, dateFolder);
      const files = fs.readdirSync(folderPath)
        .filter((fileName) => /\.(jpe?g|png|webp|gif|bmp)$/i.test(fileName));

      for (const fileName of files) {
        photos.add(path.join(folderPath, fileName));
      }
    }
  }

  return [...photos].sort((a, b) => b.localeCompare(a));
};

export const getSaveErrorMessage = (error, fallback = 'No se pudo guardar la foto.') => {
  const rawMessage = error instanceof Error ? error.message : String(error ?? '');
  const sanitizedMessage = sanitizePath(rawMessage);

  if (!sanitizedMessage || sanitizedMessage === 'Error') {
    return fallback;
  }

  return sanitizedMessage;
};

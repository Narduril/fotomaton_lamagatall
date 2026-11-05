import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

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
    path.join(os.tmpdir(), 'Fotomaton'),
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

  try {
    fs.mkdirSync(normalizedDir, { recursive: true });
    fs.accessSync(normalizedDir, fs.constants.W_OK);

    const probePath = path.join(normalizedDir, '.fotomaton-write-test');
    fs.writeFileSync(probePath, 'ok', { flag: 'wx' });
    fs.unlinkSync(probePath);

    return normalizedDir;
  } catch (error) {
    try {
      const probePath = path.join(normalizedDir, '.fotomaton-write-test');
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

  for (const root of candidateRoots) {
    const fullTargetDir = path.join(root, 'Fotomaton', dateFolderName);

    try {
      ensureDirectoryWritable(fullTargetDir);
      return fullTargetDir;
    } catch {
      continue;
    }
  }

  const fallbackRoot = path.join(os.tmpdir(), 'Fotomaton');
  const fallbackTargetDir = path.join(fallbackRoot, dateFolderName);
  ensureDirectoryWritable(fallbackTargetDir);
  return fallbackTargetDir;
};

export const getSaveErrorMessage = (error, fallback = 'No se pudo guardar la foto.') => {
  const rawMessage = error instanceof Error ? error.message : String(error ?? '');
  const sanitizedMessage = sanitizePath(rawMessage);

  if (!sanitizedMessage || sanitizedMessage === 'Error') {
    return fallback;
  }

  return sanitizedMessage;
};

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSaveErrorMessage, getStoredPhotos, resolvePhotoDirectory } from './photo-storage.js';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('photo storage helpers', () => {
  it('returns a sanitized error without exposing the user profile path', () => {
    const error = new Error(
      'ENOENT: no such file or directory, open "C:\\Users\\alice\\Pictures\\Fotomaton\\2026-11-05\\photo_123.jpeg"',
    );

    const result = getSaveErrorMessage(error);

    expect(result).toContain('[ruta-oculta]');
    expect(result).not.toContain('alice');
    expect(result).not.toContain('C:\\Users');
  });

  it('falls back to another writable directory when the preferred root is not usable', () => {
    const preferredRoot = path.join(os.tmpdir(), 'fotomaton-invalid-root');
    vi.spyOn(os, 'homedir').mockReturnValue(preferredRoot);
    vi.stubEnv('USERPROFILE', preferredRoot);
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync');
    const accessSpy = vi.spyOn(fs, 'accessSync');

    mkdirSpy.mockImplementation((targetPath) => {
      if (String(targetPath).startsWith(String(preferredRoot))) {
        throw new Error('ENOENT: no such file or directory');
      }
      return undefined;
    });

    accessSpy.mockImplementation((targetPath) => {
      if (String(targetPath).startsWith(String(preferredRoot))) {
        throw new Error('EACCES: permission denied');
      }
    });
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
    vi.spyOn(fs, 'unlinkSync').mockImplementation(() => undefined);

    const result = resolvePhotoDirectory(preferredRoot, '2026-11-05');

    expect(result).toContain('Fotomaton');
    expect(result).toContain('2026-11-05');
    expect(accessSpy).toHaveBeenCalled();
    expect(result).toContain(os.tmpdir());
  });

  it('lists photos from the same directory structure used by photo saving', () => {
    const preferredRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'fotomaton-photos-'));
    vi.spyOn(os, 'homedir').mockReturnValue(preferredRoot);
    vi.stubEnv('USERPROFILE', preferredRoot);
    try {
      const photoDirectory = path.join(preferredRoot, 'Fotomaton', '2026-11-05');
      fs.mkdirSync(photoDirectory, { recursive: true });
      const photoPath = path.join(photoDirectory, 'photo_123.jpeg');
      fs.writeFileSync(photoPath, 'photo');

      expect(getStoredPhotos(preferredRoot)).toContain(photoPath);

      const alternativeDirectory = path.join(preferredRoot, 'Pictures', 'Fotomaton', '2026-11-04');
      fs.mkdirSync(alternativeDirectory, { recursive: true });
      const alternativePhoto = path.join(alternativeDirectory, 'photo_456.jpeg');
      fs.writeFileSync(alternativePhoto, 'photo');

      expect(getStoredPhotos(preferredRoot)).toEqual(expect.arrayContaining([
        photoPath,
        alternativePhoto,
      ]));
    } finally {
      fs.rmSync(preferredRoot, { recursive: true, force: true });
    }
  });
});

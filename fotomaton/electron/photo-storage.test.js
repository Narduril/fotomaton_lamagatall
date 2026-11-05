import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { getSaveErrorMessage, resolvePhotoDirectory } from './photo-storage.js';

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

    const result = resolvePhotoDirectory(preferredRoot, '2026-11-05');

    expect(result).toContain('Fotomaton');
    expect(result).toContain('2026-11-05');
    expect(accessSpy).toHaveBeenCalled();

    mkdirSpy.mockRestore();
    accessSpy.mockRestore();
  });
});

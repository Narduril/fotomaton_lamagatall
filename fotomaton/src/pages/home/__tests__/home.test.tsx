import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from '@pages/home'

const homeMocks = vi.hoisted(() => ({
  customNavigate: vi.fn(),
  setPhotos: vi.fn(),
}))

vi.mock('@commons/hooks/use-custom-navigate/use-custom-navigate', () => ({
  default: () => ({ customNavigate: homeMocks.customNavigate }),
}))

vi.mock('@app/store/use-photos-store', () => ({
  default: () => ({
    photos: ['file:///photos/2025-01-02/a.jpeg', 'file:///photos/2025-01-01/b.jpeg'],
    setPhotos: homeMocks.setPhotos,
  }),
}))

vi.mock('@commons/components/presentational/back-button', () => ({
  default: () => null,
}))


describe('HomePage', () => {
  beforeEach(() => {
    homeMocks.customNavigate.mockReset()
    homeMocks.setPhotos.mockReset()
    window.electronAPI = {
      savePhoto: vi.fn(),
      getPhotos: vi.fn().mockResolvedValue(['file:///photos/2025-01-02/a.jpeg', 'file:///photos/2025-01-01/b.jpeg']),
      deletePhoto: vi.fn(),
    }
  })

  it('loads the stored photos from disk when the home screen mounts', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(window.electronAPI?.getPhotos).toHaveBeenCalledTimes(1)
    })

    expect(homeMocks.setPhotos).toHaveBeenCalledWith(['file:///photos/2025-01-02/a.jpeg', 'file:///photos/2025-01-01/b.jpeg'])
    expect(screen.getByRole('button', { name: /ver la galería/i })).toBeEnabled()
  })
})

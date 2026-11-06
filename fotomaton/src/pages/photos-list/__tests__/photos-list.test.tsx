import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PhotosListPage from '@pages/photos-list'

const photosStore = vi.hoisted(() => ({
  photos: [
    'file:///photos/2025-01-02/02.jpg',
    'file:///photos/2025-01-02/01.jpg',
    'file:///photos/2025-01-01/03.jpg',
    'file:///photos/2025-01-01/02.jpg',
  ],
}))

vi.mock('@app/store/use-photos-store', () => ({
  default: () => ({ photos: photosStore.photos }),
}))

vi.mock('@commons/components/presentational/back-button', () => ({
  default: () => null,
}))

vi.mock('./components/photo-modal', () => ({
  default: ({ isVisible, photo, closeModal }: { isVisible: boolean; photo: string; closeModal: () => void }) =>
    isVisible ? (
      <div role="dialog" aria-modal="true">
        <img src={photo} alt="foto ampliada" />
        <button type="button" onClick={closeModal}>close</button>
      </div>
    ) : null,
}))


describe('PhotosListPage', () => {
  beforeEach(() => {
    photosStore.photos = [
      'file:///photos/2025-01-02/02.jpg',
      'file:///photos/2025-01-02/01.jpg',
      'file:///photos/2025-01-01/03.jpg',
      'file:///photos/2025-01-01/02.jpg',
    ]
  })

  it('orders photos from the newest date to the oldest and groups them by date', () => {
    render(
      <MemoryRouter>
        <PhotosListPage />
      </MemoryRouter>,
    )

    const dates = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(dates).toEqual(['2025-01-02', '2025-01-01'])
    expect(screen.getAllByText('2025-01-02')).toHaveLength(2)
  })

  it('filters the photos by selected dates and allows resetting the filter', () => {
    render(
      <MemoryRouter>
        <PhotosListPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: '2025-01-01' }))
    expect(screen.getAllByRole('button', { name: /ampliar foto/i })).toHaveLength(2)
    expect(screen.getAllByText('2025-01-01')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Ver todas' }))
    expect(screen.getAllByRole('button', { name: /ampliar foto/i })).toHaveLength(4)
  })
})

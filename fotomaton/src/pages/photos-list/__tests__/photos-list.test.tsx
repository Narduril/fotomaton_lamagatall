import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import PhotosListPage from '../photos-list';

vi.mock('@app/store/use-photos-store', () => ({
  default: () => ({ photos: ['photo-1.jpg', 'photo-2.jpg'] }),
}));

describe('PhotosListPage', () => {
  it('renders a list of photo images', () => {
    render(
      <MemoryRouter>
        <PhotosListPage />
      </MemoryRouter>,
    );

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'photo-1.jpg');
    expect(images[1]).toHaveAttribute('src', 'photo-2.jpg');
  });
});

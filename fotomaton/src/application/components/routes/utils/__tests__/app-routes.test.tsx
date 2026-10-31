import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { appRoutes } from '../app-routes';

describe('appRoutes', () => {
  it('contains expected route entries', () => {
    expect(appRoutes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'home' }),
        expect.objectContaining({ key: 'camera' }),
        expect.objectContaining({ key: 'photos-list' }),
      ]),
    );
  });

  it('renders the home element when home route is used', () => {
    const homeRoute = appRoutes.find((route) => route.key === 'home');

    render(
      <MemoryRouter>
        {homeRoute?.element}
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /foto matón penya l' amagatall/i })).toBeInTheDocument();
  });
});

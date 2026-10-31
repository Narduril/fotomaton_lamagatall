import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../home';

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock('@commons/hooks/use-custom-navigate/use-custom-navigate', () => ({
  default: () => ({
    customNavigate: navigateMock,
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it('renders the title and action buttons', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /foto matón penya l' amagatall/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cámara/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /archivo fotos/i })).toBeInTheDocument();
  });

  it('calls customNavigate when camera button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /cámara/i }));

    expect(navigateMock).toHaveBeenCalledTimes(1);
  });
});

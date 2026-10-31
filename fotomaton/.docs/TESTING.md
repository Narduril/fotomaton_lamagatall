# Testing

This project uses Vitest + React Testing Library + jsdom for page and route tests.

## Prerequisites

- Node.js 20+
- pnpm 11+
- Dependencies installed with `pnpm install`

## Test commands

Run the suite in watch mode:

```bash
pnpm run test
```

Run the suite once:

```bash
pnpm run test:run
```

Generate a coverage report:

```bash
pnpm run test:coverage
```

## Scope of tests

Add tests for:

- page rendering and visible content
- navigation calls and route behavior
- user interactions
- state-driven rendering from stores

Prefer testing user-visible behavior instead of implementation details.

## Test setup

The shared setup is in:

- `src/application/test/setup.ts`

It enables jest-dom matchers so assertions like `toBeInTheDocument()` and `toHaveAttribute()` work correctly.

## Example page test

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import HomePage from './home';

describe('HomePage', () => {
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
  });
});
```

## Query priorities

Use the most accessible query first:

1. `getByRole`
2. `getByLabelText`
3. `getByText`
4. `getByTestId` (only if necessary)

## Router-aware tests

Pages that use `useNavigate`, `Link`, or `useLocation` must be rendered inside a router context:

```tsx
render(
  <MemoryRouter>
    <PhotosListPage />
  </MemoryRouter>,
);
```

## Mocking stores and hooks

Use `vi.mock` for:

- Zustand stores
- custom hooks such as `useCustomNavigate`
- Electron-specific APIs

Keep mocks minimal and aligned with the real behavior under test.

## Validation before finishing work

Before closing a task, run:

```bash
pnpm run test:run
pnpm run typecheck
pnpm run lint
pnpm run build
```

For desktop packaging work, also validate:

```bash
pnpm run build:desktop
```

Remember: this project is a desktop app built with Electron, so the UI must be tested in a browser-like environment while the packaging flow stays compatible with `dmg`, `exe`, and `AppImage` builds.

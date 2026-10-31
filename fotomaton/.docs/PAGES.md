# Pages guide

This project organizes pages in `src/pages/<page-name>/` with a dedicated folder per route.

## Required structure

Each page should follow this pattern:

```text
src/pages/my-page/
├── index.ts
├── my-page.tsx
├── my-page.css
```

## Page pattern

```tsx
import React from 'react';

import './my-page.css';

const MyPage: React.FC = () => {
  return (
    <section>
      <h1>My Page</h1>
    </section>
  );
};

export default MyPage;
```

And the index:

```ts
export { default } from './my-page';
```

## Route registration

Add the route path in:

- `src/application/components/routes/utils/route-paths.ts`

Then register the page in:

- `src/application/components/routes/utils/app-routes.tsx`

Example:

```ts
export const ROUTE_PATHS = {
  HOME: '/home',
  CAMERA: '/camera',
  PHOTOS_LIST: '/photos-list',
};
```

```tsx
import HomePage from '@pages/home';
import CameraPage from '@pages/camera';
import PhotosListPage from '@pages/photos-list';

export const appRoutes: RouteTypes[] = [
  {
    key: 'home',
    path: ROUTE_PATHS.HOME,
    element: <HomePage />,
  },
  {
    key: 'camera',
    path: ROUTE_PATHS.CAMERA,
    element: <CameraPage />,
  },
  {
    key: 'photos-list',
    path: ROUTE_PATHS.PHOTOS_LIST,
    element: <PhotosListPage />,
  },
];
```

## Page responsibilities

Pages should:
- orchestrate user flows
- compose reusable components
- call hooks and stores
- keep local UI logic minimal and readable
- delegate visual details to CSS and components

Avoid putting business logic directly into the page if it can be extracted into hooks or utilities.

## Styling

Each page has its own stylesheet, for example:

```css
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

Use `@pages` alias when importing page components, and `@app`/`@commons` for app-level or shared modules.

## Validation checklist

Before finalizing a page, verify:

- page folder exists with `index.ts`, component and CSS
- route path exists and is registered
- styles are scoped and readable
- component imports use aliases where possible
- project passes:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

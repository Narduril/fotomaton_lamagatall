# AI Agent Development Guide

This document guides AI agents and contributors in developing features for the Fotomaton desktop app.

## Quick Reference

| Task | Documentation |
| --- | --- |
| Getting started | [.docs/GETTING_STARTED.md](.docs/GETTING_STARTED.md) |
| Create a new page | [.docs/PAGES.md](.docs/PAGES.md) |
| Use components | [.docs/COMPONENTS.md](.docs/COMPONENTS.md) |
| Write tests | [.docs/TESTING.md](.docs/TESTING.md) |

---

## Project Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7.x | Build tooling |
| Electron | desktop runtime | Native installer packaging |
| Vitest | 5.x | Testing framework |
| pnpm | 11.x | Package manager and scripts |

---

## Project Structure

```text
src/
├── application/
│   ├── assets/
│   ├── components/
│   ├── store/
│   └── test/
├── commons/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── pages/
│   ├── camera/
│   ├── home/
│   └── photos-list/
├── main.tsx
└── ...
```

---

## Package manager workflow

This repository uses pnpm as the only package manager. Do not use npm commands in normal development.

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
pnpm install
```

When scripts or dependencies require Electron native build approval:

```bash
pnpm approve-builds
```

Use the project scripts through pnpm, for example:

```bash
pnpm run dev
pnpm run test:run
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run build:desktop
```

---

## Feature development checklist

### New page

1. Create a folder in `src/pages/{page-name}/`
2. Add the page component and CSS file
3. Add tests in the same folder using `{page-name}.test.tsx`
4. Add the route path in `src/application/components/routes/utils/route-paths.ts`
5. Add the route in `src/application/components/routes/utils/app-routes.tsx`

### New component

1. Place reusable UI in `src/commons/components/` or `src/application/components/` depending on scope
2. Keep styling local and BEM-based
3. Reuse existing patterns for navigation, handlers, and layout

---

## Code templates

### Page component

```tsx
import '@pages/{page-name}/{page-name}.css';

const PageName: React.FC = () => {
  return <h1>Page Name</h1>;
};

export default PageName;
```

### Component CSS imports

```tsx
import '@pages/home/home.css';
import '@commons/components/presentational/back-button/back-button.css';
```

Use aliases for CSS imports too, so styles remain stable when the file moves or the structure changes.

### Hook usage

```tsx
import useCustomNavigate from '@commons/hooks/use-custom-navigate/use-custom-navigate';

const { customNavigate } = useCustomNavigate();
```

### Route usage

```tsx
import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths';
```

---

## Naming conventions

| Type | Convention | Example |
| --- | --- | --- |
| Files | kebab-case | `photos-list.tsx` |
| Components | PascalCase | `PhotosListPage` |
| Functions | camelCase | `handleTakePicture` |
| CSS classes | BEM | `photos-list__container` |
| Test files | `{name}.test.tsx` | `photos-list.test.tsx` |

---

## Key patterns

### Use custom navigation

```tsx
import useCustomNavigate from '@commons/hooks/use-custom-navigate/use-custom-navigate';

const { customNavigate } = useCustomNavigate();
```

### Use app routes and aliases

```tsx
import HomePage from '@pages/home';
import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths';
```

### Test in router context

When the component uses `useNavigate`, render it with `MemoryRouter`.

---

## Testing best practices

- Prefer `getByRole` queries over CSS selectors
- Use `userEvent` for user interaction tests
- Use `MemoryRouter` when testing navigation or route-dependent components
- Mock stores and hooks only when they are not the subject under test
- Keep tests focused on visible behavior and outcomes

See [.docs/TESTING.md](.docs/TESTING.md) for project-specific Vitest instructions.

---

## Files to avoid modifying

These files are core to the app and should rarely be changed without a clear reason:

- `src/main.tsx`
- `src/application/components/application/application.tsx`
- `vite.config.ts`
- `tsconfig.app.json`
- `package.json` (only with project-wide impact)

---

## Validation checklist

Before finishing any feature, run:

```bash
pnpm run test:run
pnpm run typecheck
pnpm run lint
pnpm run build
```

If the change affects the desktop installer flow, validate packaging too:

```bash
pnpm run build:desktop
```

This project ships as a desktop application, so production validation should include both the web build and the Electron installer pipeline.

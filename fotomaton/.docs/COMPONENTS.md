# Components guide

This project uses a small, explicit component structure with shared UI in `src/commons` and app-level components in `src/application/components`.

## Where to place components

- Shared/presentational UI: `src/commons/components`
- App-level composition: `src/application/components`
- Page-scoped components: inside the relevant page folder when they are only used there

## Rules

- Keep components focused and small.
- Prefer props over global state when possible.
- Use TypeScript types for props and return values.
- Use default exports only for component modules, unless the project pattern requires a named export.
- Name files in kebab-case and component names in PascalCase.

## Example

```tsx
import React from 'react';

type BackButtonProps = {
  label?: string;
  onClick?: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ label = 'Back', onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default BackButton;
```

## Reusable patterns in this project

### Custom hooks

Hooks go under `src/commons/hooks` or a feature-specific folder when relevant.

Example:

```tsx
import { useNavigate } from 'react-router-dom';

const useCustomNavigate = () => {
  const navigate = useNavigate();

  const customNavigate = (to: string) => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition(() => navigate(to));
  };

  return { customNavigate };
};

export default useCustomNavigate;
```

### Shared components

Use `@commons` for reusable imports:

```tsx
import BackButton from '@commons/components/presentational/back-button';
```

### App components

Use `@app` for app-level composition such as routes and layout wrappers:

```tsx
import RoutesComponent from '@app/components/routes';
```

## Styling

- Keep per-component CSS next to the component when it is local.
- Use global CSS only for app-wide defaults and resets.
- Name classes with a BEM-like convention.

Example:

```css
.back-button {
  display: flex;
  justify-content: flex-end;
}

.back-button__cross {
  color: #fff;
  font-size: 50px;
}
```

## Good practices

- Avoid logic duplication across components.
- Prefer composition over large branching components.
- Keep all component props typed.
- Ensure new components are exported from an index when used across modules.

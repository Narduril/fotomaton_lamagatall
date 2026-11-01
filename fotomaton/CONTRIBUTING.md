# Contributing

Thanks for helping improve Fotomaton.

## Project workflow

This repository uses pnpm as the only package manager.

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
pnpm install
pnpm run dev
```

If Electron/esbuild scripts are blocked, approve them:

```bash
pnpm approve-builds
```

## Before creating a PR

Run these checks locally:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

If you are preparing a desktop release, also validate the packaging workflow:

```bash
pnpm run build:desktop
```

## Coding standards

- Use TypeScript for new code.
- Prefer alias imports (`@`, `@app`, `@pages`, `@commons`).
- Keep components focused and typed.
- Keep page logic readable and composable.
- Use CSS files close to the component/page they style.
- Follow the conventions defined in the docs inside `.docs/`.

## Documentation

Key docs:

- [.docs/GETTING_STARTED.md](.docs/GETTING_STARTED.md)
- [.docs/COMPONENTS.md](.docs/COMPONENTS.md)
- [.docs/PAGES.md](.docs/PAGES.md)
- [AGENTS.md](AGENTS.md)

## Pull request expectations

- Keep changes focused and reviewable.
- Update docs when behavior or project workflow changes.
- Ensure the app still builds successfully.
- Prefer small, intentional commits over broad refactors.

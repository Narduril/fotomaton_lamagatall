# Getting started

This document explains how to start working on the project from a clean environment.

## Prerequisites

- Node.js 20+
- pnpm 11+
- Git

## Bootstrap

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
pnpm install
```

If pnpm asks to approve native dependency builds (Electron/esbuild), run:

```bash
pnpm approve-builds
```

Select these packages when prompted:
- `electron`
- `electron-winstaller`
- `esbuild`

## Development

Start the app in development mode:

```bash
pnpm run dev
```

This starts both:
- Vite dev server
- Electron desktop app

## Type check

```bash
pnpm run typecheck
```

## Lint

```bash
pnpm run lint
```

## Production build

Build the web app:

```bash
pnpm run build
```

Build the Electron package for desktop installation:

```bash
pnpm run electron:build
```

This project is intended to ship as a desktop app, so build output can be distributed as DMG/EXE/AppImage depending on the platform.

Or do both in one step:

```bash
pnpm run dist
```

For a dedicated desktop packaging step:

```bash
pnpm run build:desktop
```

## Recommended workflow

1. Start with `pnpm install`
2. Work locally with `pnpm run dev`
3. Validate with `pnpm run lint` and `pnpm run typecheck`
4. Before finishing, run `pnpm run build`
5. If packaging is required, run `pnpm run dist`

## Important notes

- Use `pnpm` for all installs and script runs.
- Do not mix `npm` and `pnpm` in the same repo.
- Keep `pnpm-lock.yaml` and `package.json` in sync when changing dependencies.
- If you add or update a package, rerun install and validation commands before opening a PR.

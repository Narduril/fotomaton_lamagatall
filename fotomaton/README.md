# Fotomaton

Aplicación React + TypeScript + Vite con Electron para escritorio.

## Requisitos

- Node.js 20+
- pnpm 11+

## Instalación

1. Instala pnpm si no lo tienes:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

2. En la raíz del proyecto, instala dependencias:

```bash
pnpm install
```

3. Si aparece un bloqueo de build scripts por Electron/esbuild, acepta los paquetes necesarios:

```bash
pnpm approve-builds
```

Selecciona:
- `electron`
- `electron-winstaller`
- `esbuild`

## Desarrollo

Inicia la app en modo desarrollo con Vite + Electron:

```bash
pnpm run dev
```

Esto levanta el servidor Vite y la aplicación Electron con la app cargada.

## Build de producción

Compila la app web:

```bash
pnpm run build
```

Genera el paquete Electron para instalar como aplicación de escritorio:

```bash
pnpm run electron:build
```

O genera todo en un único paso:

```bash
pnpm run dist
```

Cuando se ejecuta el build de Electron, el proyecto genera instaladores nativos según el sistema operativo:
- macOS: `.dmg`
- Windows: `.exe`
- Linux: `.AppImage`

También existe el script orientado a empaquetado de escritorio:

```bash
pnpm run build:desktop
```

## Scripts disponibles

```bash
pnpm run dev
pnpm run build
pnpm run lint
pnpm run preview
pnpm run start
pnpm run electron:build
pnpm run dist
pnpm run build:desktop
pnpm run typecheck
```

## Estructura principal

```text
fotomaton/
├── electron/
├── public/
├── src/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

## Nota importante

Este proyecto usa pnpm como gestor de paquetes. No uses `npm install` ni `npm run ...` para mantener consistencia con el lockfile del proyecto.

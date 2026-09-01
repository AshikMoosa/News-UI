# News UI

A framework-agnostic Web Component design system (Lit) plus a vanilla JS product app that consumes it directly — no React/Next, no TypeScript. Built as a Turborepo + npm workspaces monorepo.

## Structure

```
apps/
  web/                 # framework-agnostic product app (Vite + JS)
packages/
  ui/                  # Lit component library (design system)
  tokens/              # W3C DTCG token source + Style Dictionary build
  utils/               # shared framework-agnostic helpers
  react-wrapper/       # @lit/react generated wrappers (DX package)
.storybook/            # Storybook config, consumes packages/ui
docs/adr/              # Architecture Decision Records
```

See [docs/adr](docs/adr) for the reasoning behind the architecture choices.

## Getting started

```bash
npm install
npm run build
npm run dev
npm run lint
npm run test
npm run test:a11y
npm run storybook
```

## Status

- Phase 0 (tooling scaffold) — done.
- Phase 1 (design system) — in progress: `@news-ui/tokens` (color, spacing, radius,
  typography, motion, elevation, light/dark theming) and `@news-ui/ui`'s first
  component, `news-button`, are built end-to-end (component + Vitest unit tests +
  axe-core a11y tests + Storybook story).
- `apps/web` (product app) — not started.

# News UI

A framework-agnostic Web Component design system (Lit) plus a vanilla JS/TS product app that consumes it directly — no React/Next required. Built as a Turborepo + npm workspaces monorepo.

## Structure

```
apps/
  web/                 # framework-agnostic product app (Vite + TS)
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
```

## Status

Phase 0 (tooling scaffold) complete. Design system and product app packages are pending.

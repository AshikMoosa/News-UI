# ADR 0001: Monorepo and Framework Choices

## Status

Accepted

## Context

This repository hosts a portfolio project: a framework-agnostic Web Component
design system plus a product app that consumes it, built to demonstrate
senior-level UI engineering judgment (architecture, accessibility, testing,
release process) for Big Tech / senior UI engineer interviews.

Several foundational choices had to be made before any component or app code
could be written: how the repo is organized, what component framework the
design system is built on, what (if anything) the product app is built with,
and what package manager ties it together.

## Decision

| Decision              | Choice                                                                                  | Rationale                                                                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Work location         | Linked local machine via Claude desktop app, opened in VS Code                          | Keeps one canonical git history, avoids cloud/local drift                                                                                                                  |
| Monorepo tool         | Turborepo + npm workspaces                                                              | Fast to set up, strong caching, widely recognized in interviews without Nx's config overhead                                                                               |
| Component framework   | Lit (thin wrapper over Web Components)                                                  | Small runtime, native Shadow DOM/Custom Elements alignment, easy to justify "why not vanilla" in interviews                                                                |
| Product app framework | Framework-agnostic — vanilla JS/TS consuming the Lit components directly, no React/Next | Proves the design system truly works framework-agnostically; framework wrappers (`@lit/react` etc.) still get built as a DX exercise but aren't required by the app itself |
| Package manager       | npm (workspaces-native, zero extra tooling)                                             | Matches Turborepo's default path, one less tool to explain                                                                                                                 |

## Repository layout

```
apps/
  web/                 # framework-agnostic product app (Vite + TS)
packages/
  ui/                  # Lit component library (design system)
  tokens/              # W3C DTCG token source + Style Dictionary build
  utils/               # shared framework-agnostic helpers (a11y utils, focus trap, etc.)
  react-wrapper/        # @lit/react generated wrappers (DX package, built after core components stabilize)
.storybook/            # Storybook config, consumes packages/ui
.github/workflows/      # CI: lint, test, build, chromatic, release
docs/adr/               # Architecture Decision Records, one file per decision
```

This structure is established from day one (Phase 0) even though `packages/ui`,
`packages/tokens`, and `apps/web` are scaffolded later, so later phases never
require a restructure.

## Consequences

- No React/Next means some product-app concerns (routing, state, data
  fetching) are hand-rolled rather than using an established framework
  ecosystem. This is intentional: it demonstrates the underlying patterns
  rather than hiding them behind a framework.
- `packages/react-wrapper` is deliberately deferred until 3–4 core components
  stabilize, to avoid wrapper churn while the component API is still moving.
- Turborepo + npm workspaces is a lighter-weight choice than Nx; it trades
  some advanced generator/plugin tooling for a setup that's fast to explain
  and reason about in an interview context.

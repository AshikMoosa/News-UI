# ADR 0003: Narrow this repository's scope to the design system only

## Status

Accepted

## Context

ADR 0001 planned this repository as a monorepo holding both the design
system (`packages/tokens`, `packages/ui`) and a framework-agnostic product
app (`apps/web`) that consumes it, plus CI/governance scaffolding
(`.github/workflows`) for that combined setup.

The product app and its release/CI governance turned out to belong to a
separate project, tracked and versioned on its own. Keeping a placeholder
`apps/web` and an empty `.github/workflows` in this repository mixed two
unrelated projects' concerns in one git history and one set of tooling
config, for no benefit — nothing had been built in either yet.

## Decision

This repository now holds only the design system:

- `packages/tokens` — DTCG token source + Style Dictionary build
- `packages/ui` — the Lit component library
- `.storybook/` — previews `packages/ui`
- `docs/adr/` — decisions about the design system itself

Removed: `apps/web` (empty placeholder), `.github/workflows` (empty
placeholder), the `apps/*` npm workspace glob, and every config reference to
either (Turborepo's `dev` task, Vitest's and ESLint's `apps/*` globs).

`packages/react-wrapper` and `packages/utils` are kept — both are
design-system deliverables (a framework wrapper and shared a11y/DOM helpers
for the components themselves), not part of the removed product app.

## Consequences

- This repo's `npm run dev` no longer exists; previewing components is done
  exclusively via `npm run storybook`, which was already the actual
  workflow in practice.
- ADR 0001's repository-layout diagram and "product app framework" row are
  now historical — accurate for the decision as originally made, superseded
  in that respect by this ADR. Its component-framework, language, and
  package-manager decisions are unaffected and still stand.
- If a product app consuming this library is built again later, it belongs
  in its own repository that depends on `@news-ui/tokens` and `@news-ui/ui`
  as published packages, not back inside this one.

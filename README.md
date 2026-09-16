# News UI

**A framework-agnostic Web Component design system, built with [Lit](https://lit.dev).**

News UI is a from-scratch component library exploring what a modern design
system looks like when it's built directly on the platform — native Custom
Elements and Shadow DOM, Form-Associated Custom Elements for real `<form>`
participation, and a design-token pipeline compiled to plain CSS custom
properties — with no framework runtime (React, Vue, etc.) required to
consume it.

Its visual identity is a **classic newspaper / editorial** aesthetic: warm
cream surfaces, near-black ink, a single masthead-red accent, three
purpose-built typefaces, and hairline rules instead of drop shadows. See
[Design tokens](#design-tokens) below and [ADR 0002](docs/adr/0002-newspaper-design-system.md)
for the full rationale.

## Status

Early and actively developed. All of the original form-control set is now
built — seven components:

| Component                         | What it is                                                      | Notes                                                                                                |
| --------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `news-button`                     | Primary/secondary/outline/ghost/danger variants, 4 sizes        |                                                                                                      |
| `news-input`                      | Labeled text field with prefix/suffix and hint/error messaging  | A real [Form-Associated Custom Element](#form-associated-custom-elements)                            |
| `news-checkbox`                   | Square hairline box, checkmark/indeterminate states             | Also a [Form-Associated Custom Element](#form-associated-custom-elements)                            |
| `news-radio-group` + `news-radio` | Round hairline rings, one selectable at a time                  | The group is the Form-Associated Custom Element; `news-radio` is a presentational ARIA `radio` child |
| `news-switch`                     | Hairline track + sliding thumb, sm/md sizes                     | Also a [Form-Associated Custom Element](#form-associated-custom-elements); `role="switch"`           |
| `news-textarea`                   | Multi-line counterpart to `news-input`                          | Also a [Form-Associated Custom Element](#form-associated-custom-elements)                            |
| `news-select`                     | Dropdown built on a native `<select>`, options as a JS property | Also a [Form-Associated Custom Element](#form-associated-custom-elements)                            |

Everything else in the [component roadmap](#component-roadmap) below is
planned but not yet built.

## Preview

Every component has a [Storybook](https://storybook.js.org) story with
live controls and an automated accessibility panel (axe-core).

```bash
npm install
npm run storybook
```

Opens at `http://localhost:6006`.

## Packages

This is an [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) +
[Turborepo](https://turborepo.dev) monorepo with two packages:

| Package                              | Description                                                                                                                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@news-ui/tokens`](packages/tokens) | Design tokens authored as [W3C DTCG](https://www.designtokens.org/tr/drafts/format/)-format JSON, compiled with [Style Dictionary](https://styledictionary.com) to CSS custom properties and plain JS constants. |
| [`@news-ui/ui`](packages/ui)         | The Lit component library. Every custom element is prefixed `news-` (e.g. `news-button`).                                                                                                                        |

## Getting started

```bash
npm install          # install all workspace dependencies
npm run build         # build @news-ui/tokens (CSS + JS output)
npm run lint           # ESLint across every package
npm run test            # Vitest unit tests (jsdom)
npm run test:a11y        # axe-core accessibility tests
npm run storybook         # component playground at localhost:6006
npm run build-storybook    # static Storybook build
```

Each script fans out through Turborepo to every workspace package that
defines it — see [`turbo.json`](turbo.json) for task wiring and caching.

## Design tokens

Tokens are the single source of truth for color, type, spacing, radius,
border width, motion, and elevation. They compile to:

- `packages/tokens/dist/css/tokens.css` — light (default) theme, `--news-*` custom properties on `:root`
- `packages/tokens/dist/css/tokens.dark.css` — dark theme, via both `[data-theme="dark"]` and `prefers-color-scheme`
- `packages/tokens/dist/js/tokens.js` — the same values as plain JS constants

Components read these custom properties directly and ship **no hardcoded
color fallbacks** — loading the tokens' CSS is a hard requirement, not an
optional nicety. See [`packages/tokens/README.md`](packages/tokens/README.md)
for the full token catalogue.

## Form-Associated Custom Elements

Every form control (`news-input`, `news-checkbox`, `news-radio-group`,
`news-switch`, `news-textarea`, `news-select`) is a real [Form-Associated Custom Element](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals):
`static formAssociated = true` plus `ElementInternals` for form value and
constraint-validation participation — the same contract a native `<input>`
honors, with no hidden mirror input and no form-library glue.

jsdom (the test environment) doesn't implement `ElementInternals`' form
side yet, only its ARIA-reflection half — see
[`packages/ui/src/test-setup/element-internals-polyfill.js`](packages/ui/src/test-setup/element-internals-polyfill.js)
for the test-only shim that makes these components unit-testable, and
[`packages/ui/README.md`](packages/ui/README.md) for details.

## Component roadmap

Tracking the full surface sketched out in the design reference. All form
controls are now built; everything below is not yet started.

| Component                               | Status     |
| --------------------------------------- | ---------- |
| Button                                  | ✅ Built   |
| Text input                              | ✅ Built   |
| Checkbox                                | ✅ Built   |
| Radio group                             | ✅ Built   |
| Switch                                  | ✅ Built   |
| Textarea                                | ✅ Built   |
| Select                                  | ✅ Built   |
| Badge, Card, Alert, Tooltip, Modal      | 📋 Planned |
| Tabs, Breadcrumb, Pagination, Accordion | 📋 Planned |

## Project structure

```
packages/
  tokens/              # design tokens: DTCG source + Style Dictionary build
  ui/                  # the Lit component library
  react-wrapper/       # @lit/react wrappers (planned, once several components stabilize)
  utils/               # shared framework-agnostic helpers (a11y, focus trap, etc.)
.storybook/            # Storybook config, previews packages/ui
docs/adr/              # Architecture Decision Records
```

## Architecture decisions

Every non-trivial choice is recorded as an ADR in [`docs/adr`](docs/adr):

- [0001 — Monorepo and framework choices](docs/adr/0001-monorepo-and-framework-choices.md)
- [0002 — Adopt the "classic newspaper" design system](docs/adr/0002-newspaper-design-system.md)
- [0003 — Narrow this repository's scope to the design system](docs/adr/0003-narrow-repo-scope-to-design-system.md)

## Tech stack

| Concern              | Choice                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Component framework  | [Lit](https://lit.dev) — thin, standards-based wrapper over native Web Components                                  |
| Language             | Plain JavaScript — no TypeScript, no build-time type stripping                                                     |
| Design tokens        | [Style Dictionary](https://styledictionary.com), [W3C DTCG](https://www.designtokens.org/tr/drafts/format/) format |
| Monorepo             | npm workspaces + [Turborepo](https://turborepo.dev)                                                                |
| Testing              | [Vitest](https://vitest.dev) + jsdom, [axe-core](https://github.com/dequelabs/axe-core) for accessibility          |
| Component explorer   | [Storybook](https://storybook.js.org) (web-components-vite)                                                        |
| Linting / formatting | ESLint (flat config) + Prettier                                                                                    |
| Git hooks            | Husky + lint-staged + commitlint ([Conventional Commits](https://www.conventionalcommits.org))                     |

## Development workflow

- Commits follow [Conventional Commits](https://www.conventionalcommits.org)
  (enforced by commitlint on `commit-msg`); `pre-commit` runs lint-staged
  (ESLint + Prettier) on staged files.
- No TypeScript, anywhere — see [ADR 0001](docs/adr/0001-monorepo-and-framework-choices.md).
  Component contracts (properties, events, slots, CSS custom properties,
  parts) are documented via JSDoc on each component.
- New components should follow the pattern established by `news-button`
  (presentational) and `news-input` (Form-Associated): a `.js` file, a
  `.test.js` (Vitest), a `.a11y.test.js` (axe-core), and a `.stories.js`
  (Storybook), all colocated under `packages/ui/src/<component-name>/`.

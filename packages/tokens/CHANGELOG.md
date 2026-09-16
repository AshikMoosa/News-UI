# Changelog

All notable changes to `@news-ui/tokens` are documented here. Versioning
follows [Semantic Versioning](https://semver.org); while the package is
`0.x`, each new component "pack" released in `@news-ui/ui` bumps the minor
version here to match, even when the token changes themselves are small.

## 0.1.0 — 2026-09-16

Initial release. Design tokens for the "classic newspaper" editorial
identity (see `docs/adr/0002-newspaper-design-system.md` in the repo):

- `color` — cream/ink/masthead-red palette, named semantic roles
  (`surface.*`, `text.*`, `border.*`, `action.*`, `feedback.*`)
- `typography` — three families (display/body/mono) and a separate
  label-size scale for uppercase UI chrome text
- `spacing`, `radius`, `border` (hairline/thick widths), `motion`,
  `elevation`
- Light theme (default) and dark theme (`[data-theme="dark"]` +
  `prefers-color-scheme`)

Compiled to `dist/css/tokens.css`, `dist/css/tokens.dark.css`, and
`dist/js/tokens.js`.

# Changelog

All notable changes to `@news-ui/ui` are documented here. Versioning
follows [Semantic Versioning](https://semver.org). Each release is a
curated "pack" of components — while the package is `0.x`, a new pack
bumps the **minor** version (`0.1.0` → `0.2.0`); fixes to an already-released
pack bump the **patch** version instead.

## 0.1.0 — 2026-09-16

Initial release — the button + form-controls pack. All Form-Associated
Custom Elements (`static formAssociated = true` + `ElementInternals`)
except `news-button` and `news-radio` (see each component's JSDoc for why).

- `news-button` — primary/secondary/outline/ghost/danger variants, 4 sizes
- `news-input` — labeled text field, prefix/suffix, hint/error messaging
- `news-checkbox` — checked/indeterminate states
- `news-radio-group` + `news-radio` — roving-tabindex ARIA radio group
- `news-switch` — on/off toggle, `role="switch"`
- `news-textarea` — multi-line counterpart to `news-input`
- `news-select` — dropdown on a native `<select>`, options as a JS property
- `news-slider` — range input with a live value display

Requires `@news-ui/tokens` `^0.1.0`'s CSS to be loaded on the page.

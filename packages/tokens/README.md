# @news-ui/tokens

Design tokens authored as W3C DTCG-format JSON (`$value`/`$type`), compiled with Style Dictionary to:

- `dist/css/tokens.css` — light (default) CSS custom properties on `:root`, prefixed `--news-*`
- `dist/css/tokens.dark.css` — dark overrides, both as `[data-theme='dark']` and `@media (prefers-color-scheme: dark)`
- `dist/js/tokens.js` — plain JS `const` exports of every resolved token value

Consumers import both CSS files; components read the same custom-property names in both themes and never branch on theme directly.

## Design language

Tokens encode a "classic newspaper" editorial identity (see [ADR 0002](../../docs/adr/0002-newspaper-design-system.md)):

- **Color** — warm cream page background, near-black ink for text/borders, a single masthead-red accent. No neutral gray ramp; every surface/text/border role is a named token (`color.surface.card`, `color.text.muted`, etc.), not a numbered scale.
- **Type** — three families with distinct jobs: `font.family.display` (Playfair Display, headlines), `font.family.body` (Source Serif 4, long-form copy), `font.family.mono` (Space Mono, uppercase UI chrome like buttons/labels/bylines). `font.label-size.*` is a separate, smaller scale from `font.size.*` because chrome text and reading text are never the same size.
- **Shape** — `radius.none` (0) is the default everywhere; `radius.full` is reserved for pills/circles (switches, avatars).
- **Structure** — hairline borders (`border.width.hairline`, 1px) do the work shadows would do in most systems; `border.width.thick` (3px) marks emphasis rules. There is no default drop-shadow token in use.

## Source layout

```
tokens/            # base (light) token source, one file per category
  color.json
  spacing.json
  radius.json
  border.json
  typography.json
  motion.json
  elevation.json
themes/
  dark.json        # only the tokens that change in dark mode
```

## Build

```bash
npm run build --workspace=@news-ui/tokens
```

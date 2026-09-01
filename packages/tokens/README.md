# @news-ui/tokens

Design tokens authored as W3C DTCG-format JSON (`$value`/`$type`), compiled with Style Dictionary to:

- `dist/css/tokens.css` — light (default) CSS custom properties on `:root`, prefixed `--news-*`
- `dist/css/tokens.dark.css` — dark overrides, both as `[data-theme='dark']` and `@media (prefers-color-scheme: dark)`
- `dist/js/tokens.js` — plain JS `const` exports of every resolved token value

Consumers import both CSS files; components read the same custom-property names in both themes and never branch on theme directly.

## Source layout

```
tokens/            # base (light) token source, one file per category
  color.json
  spacing.json
  radius.json
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

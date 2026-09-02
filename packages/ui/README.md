# @news-ui/ui

Lit-based Web Component design system. Every custom element is named with a
`news-` prefix (e.g. `news-button`).

## Components

- `news-button` — primary/secondary/outline/ghost/danger variants, xs/sm/md/lg
  sizes, Shadow DOM + `::part(button)`, reduced-motion aware, dispatches
  `news-click`. Styled after the classic-newspaper design system (flat
  corners, hairline border, uppercase monospace label) — see
  [ADR 0002](../../docs/adr/0002-newspaper-design-system.md).

## Usage

Requires `@news-ui/tokens`'s CSS to be loaded on the page (the component
reads colors/type/spacing from those custom properties, with no hardcoded
fallbacks):

```html
<link rel="stylesheet" href="/node_modules/@news-ui/tokens/dist/css/tokens.css" />
<link rel="stylesheet" href="/node_modules/@news-ui/tokens/dist/css/tokens.dark.css" />
```

```js
import '@news-ui/ui/src/news-button/news-button.js';
```

```html
<news-button variant="primary" size="md">Save</news-button>
<news-button variant="danger" size="sm">Delete</news-button>
```

## Testing

```bash
npm run test --workspace=@news-ui/ui       # functional tests (Vitest + jsdom)
npm run test:a11y --workspace=@news-ui/ui  # axe-core accessibility checks
```

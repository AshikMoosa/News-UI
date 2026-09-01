# @news-ui/ui

Lit-based Web Component design system. Every custom element is named with a
`news-` prefix (e.g. `news-button`).

## Components

- `news-button` — primary/secondary/ghost variants, Shadow DOM + `::part(button)`,
  reduced-motion aware, dispatches `news-click`.

## Usage

```js
import '@news-ui/ui/src/news-button/news-button.js';
```

```html
<news-button variant="primary">Save</news-button>
```

## Testing

```bash
npm run test --workspace=@news-ui/ui       # functional tests (Vitest + jsdom)
npm run test:a11y --workspace=@news-ui/ui  # axe-core accessibility checks
```

# @news-ui/ui

Lit-based Web Component design system. Every custom element is named with a
`news-` prefix (e.g. `news-button`).

## Components

- `news-button` — primary/secondary/outline/ghost/danger variants, xs/sm/md/lg
  sizes, Shadow DOM + `::part(button)`, reduced-motion aware, dispatches
  `news-click`. Styled after the classic-newspaper design system (flat
  corners, hairline border, uppercase monospace label) — see
  [ADR 0002](../../docs/adr/0002-newspaper-design-system.md).
- `news-input` — labeled text field with optional prefix/suffix and a hint or
  error message, `::part(label|field|prefix|input|suffix|message)`. A
  **Form-Associated Custom Element**: `static formAssociated = true` plus
  `ElementInternals` (`setFormValue`/`setValidity`) let it participate in
  native `<form>` submission and constraint validation like a real
  `<input>` — no hidden mirror input, no form-library glue. Dispatches
  `news-input` (every keystroke) and `news-change` (on commit).

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
import '@news-ui/ui/src/news-input/news-input.js';
```

```html
<news-button variant="primary" size="md">Save</news-button>
<news-button variant="danger" size="sm">Delete</news-button>

<news-input label="Email address" type="email" name="email" required></news-input>
```

## Form-Associated Custom Elements

`news-input` (and every form control built after it — checkbox, radio,
select, switch) follows the same pattern: `static formAssociated = true`,
`this._internals = this.attachInternals()` in the constructor, and
`this._internals.setFormValue(...)` / `setValidity(...)` kept in sync in
`updated()`. This is a real browser API (Chrome/Firefox/Safari have shipped
it for years) — **jsdom does not implement its form-association surface**
(`setFormValue`, `setValidity`, `form`, `validity`, lifecycle callbacks like
`formResetCallback`), only its ARIA-reflection half. `src/test-setup/element-internals-polyfill.js`
patches just enough of it for Vitest to unit-test these components; it's
test-only infrastructure, loaded via `vitest.config.js`'s `setupFiles`, and
is never imported by component source.

## Testing

```bash
npm run test --workspace=@news-ui/ui       # functional tests (Vitest + jsdom)
npm run test:a11y --workspace=@news-ui/ui  # axe-core accessibility checks
```

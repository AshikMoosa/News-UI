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
- `news-checkbox` — a square hairline box that fills solid ink when checked,
  with checkmark/indeterminate-dash icons, `::part(label|input|box|text)`.
  Also a **Form-Associated Custom Element**; the native `<input
type="checkbox">` is visually hidden but positioned exactly over the
  visible box, so it stays the real click/focus/AT target. Dispatches
  `news-change` with `{ checked }`.
- `news-radio-group` + `news-radio` — a round hairline ring per option, one
  selectable at a time. `news-radio-group` is the **Form-Associated Custom
  Element** (owns the value, validity, and a roving-`tabindex` ARIA
  `radiogroup` with Arrow-key navigation); `news-radio` is a plain
  presentational `role="radio"` child — not form-associated itself, and
  deliberately not backed by a native `<input type="radio">`, since native
  radio grouping via a shared `name` doesn't reach across the separate
  Shadow DOM tree each `news-radio` has. Dispatches `news-change` with
  `{ value }` on the group.
- `news-switch` — a hairline track that fills solid ink with a sliding thumb
  when on, sm/md sizes, `::part(label|input|track|thumb|text)`. Same
  mechanics as `news-checkbox` (a native, visually-hidden `<input
type="checkbox">` is the real control), plus `role="switch"` on that
  input so assistive tech announces it as a switch rather than a checkbox,
  per the WAI-ARIA switch pattern. Dispatches `news-change` with `{ checked }`.
- `news-textarea` — the multi-line counterpart to `news-input`: labeled,
  hairline-bordered, with a hint or error message, `::part(label|textarea|message)`.
  Same **Form-Associated Custom Element** pattern, built on a native
  `<textarea>`. Dispatches `news-input` (every keystroke) and `news-change`
  (on commit).
- `news-select` — a dropdown built on a native `<select>` (native appearance
  suppressed via `appearance: none`, a custom chevron drawn over it),
  `::part(label|field|select|chevron|message)`. `<option>`s can't be
  reliably slotted into a `<select>` living in Shadow DOM from light-DOM
  children across browsers, so options are supplied as a JS array property
  (`{ value, label, disabled? }`) that the component renders itself. Also a
  **Form-Associated Custom Element**; supports an optional `placeholder`
  that renders a disabled, hidden `<option value="">`, which is what makes
  `required` validation meaningful (otherwise a native select always has
  _something_ selected). Dispatches `news-change` with `{ value }`.
- `news-slider` — a flat, hairline-bordered track with a square thumb, built
  on a native `<input type="range">`, `::part(header|label|value|input)`.
  When `label` is set it's shown alongside the live numeric value
  (right-aligned, bold). Also a **Form-Associated Custom Element**; unlike
  the other form controls it has no `required`/`error`/`hint` — a range
  always has a value, it can never be "empty". Dispatches `news-input`
  while dragging and `news-change` on release.

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
import '@news-ui/ui/src/news-checkbox/news-checkbox.js';
import '@news-ui/ui/src/news-radio-group/news-radio-group.js';
import '@news-ui/ui/src/news-radio/news-radio.js';
import '@news-ui/ui/src/news-switch/news-switch.js';
import '@news-ui/ui/src/news-textarea/news-textarea.js';
import '@news-ui/ui/src/news-select/news-select.js';
import '@news-ui/ui/src/news-slider/news-slider.js';
```

```html
<news-button variant="primary" size="md">Save</news-button>
<news-button variant="danger" size="sm">Delete</news-button>

<news-input label="Email address" type="email" name="email" required></news-input>

<news-checkbox name="terms" required>I agree to the terms of service</news-checkbox>

<news-radio-group name="delivery" label="Delivery method" required>
  <news-radio value="print">Print edition</news-radio>
  <news-radio value="digital">Digital edition</news-radio>
</news-radio-group>

<news-switch name="notifications" checked>Email me about new articles</news-switch>

<news-textarea label="Comments" name="comments" rows="6"></news-textarea>

<!-- `options` is a JS property, not an attribute — set it from script:
     selectEl.options = [{ value: 'world', label: 'World' }, ...] -->
<news-select name="section" label="Section" placeholder="Choose a section…" required></news-select>

<news-slider name="font-size" label="Font size" value="16" min="12" max="24"></news-slider>
```

## Form-Associated Custom Elements

`news-input`, `news-checkbox`, `news-radio-group`, `news-switch`,
`news-textarea`, `news-select`, and `news-slider` follow the same pattern: `static formAssociated = true`,
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

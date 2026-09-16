import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A range slider styled after the News UI newspaper design
 * system: a flat, hairline-bordered track with a square thumb — flat like
 * every other control in the system, not the rounded shape browsers
 * default a range input's thumb to. Built on a native
 * `<input type="range">`; when `label` is set, it renders alongside the
 * live numeric value, right-aligned and bold.
 *
 * A Form-Associated Custom Element: participates in native `<form>`
 * submission via `ElementInternals`, the same way a real
 * `<input type="range" name="...">` would. `required`/validity don't apply
 * here — a range always has a value, it can never be "empty" — so unlike
 * the other form controls this one has no `error`/`hint` messaging.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-slider
 *
 * @csspart header - The row showing the label and current value, when `label` is set.
 * @csspart label - The label text.
 * @csspart value - The current value, shown next to the label.
 * @csspart input - The native `<input type="range">`.
 *
 * @fires news-input - Dispatched while dragging, `detail: { value }`.
 * @fires news-change - Dispatched when the value is committed (on release), `detail: { value }`.
 */
export class NewsSlider extends BaseElement {
  static formAssociated = true;

  static properties = {
    /** Shown above the track, alongside the live value. Omit to hide the whole header row. */
    label: { type: String },
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    disabled: { type: Boolean, reflect: true },
    name: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--news-spacing-1, 0.25rem);
      width: 100%;
    }

    :host([disabled]) {
      opacity: 0.4;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .label {
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-2xs, 0.625rem);
      letter-spacing: var(--news-font-letter-spacing-wide, 0.1em);
      text-transform: uppercase;
      color: var(--news-color-text-muted);
    }

    .value {
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-2xs, 0.625rem);
      font-weight: var(--news-font-weight-bold, 700);
      color: var(--news-color-text-primary);
    }

    /* ── The track ────────────────────────────────────────────────────
       Range inputs are the most inconsistent native control to restyle
       across engines — Chromium and Firefox split "track" and "thumb"
       into different vendor-prefixed pseudo-elements with no unprefixed
       equivalent, so both need their own rules. This targets Chromium
       (this project's primary target); the -moz-* rules bring Firefox
       to the same look without being the main focus. */
    input[type='range'] {
      all: unset;
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 0.375rem;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      border-radius: var(--news-radius-none, 0);
      background-color: var(--news-color-surface-muted);
      cursor: pointer;
    }

    :host([disabled]) input[type='range'] {
      cursor: not-allowed;
    }

    input[type='range']:focus-visible {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    input[type='range']::-webkit-slider-runnable-track {
      width: 100%;
      height: 100%;
      background: transparent;
    }

    /* Chromium/WebKit don't auto-center a custom thumb over the track —
       the thumb's height minus the track's height, halved, pulls it up
       into vertical center: (0.75rem - 0.375rem) / 2 = 0.1875rem. */
    input[type='range']::-webkit-slider-thumb {
      appearance: none;
      width: 0.75rem;
      height: 0.75rem;
      margin-top: -0.1875rem;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      border-radius: var(--news-radius-none, 0);
      background-color: var(--news-color-text-primary);
      cursor: pointer;
    }

    input[type='range']::-moz-range-track {
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
    }

    input[type='range']::-moz-range-thumb {
      width: 0.75rem;
      height: 0.75rem;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      border-radius: var(--news-radius-none, 0);
      background-color: var(--news-color-text-primary);
      cursor: pointer;
    }

    :host([disabled]) input[type='range']::-webkit-slider-thumb,
    :host([disabled]) input[type='range']::-moz-range-thumb {
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
    this.name = '';
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Captured once, on first connection, so formResetCallback can restore
    // whatever the author declared rather than always resetting to 0.
    if (this._defaultValue === undefined) {
      this._defaultValue = this.value;
    }
  }

  get form() {
    return this._internals.form;
  }

  get validity() {
    return this._internals.validity;
  }

  get validationMessage() {
    return this._internals.validationMessage;
  }

  get willValidate() {
    return this._internals.willValidate;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }

  updated(changedProperties) {
    if (changedProperties.has('value')) {
      this._internals.setFormValue(String(this.value));
    }
  }

  formResetCallback() {
    this.value = this._defaultValue ?? 0;
  }

  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state) {
    this.value = Number(state ?? 0);
  }

  _handleInput(event) {
    this.value = Number(event.target.value);
    this.dispatchEvent(
      new CustomEvent('news-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleChange() {
    this.dispatchEvent(
      new CustomEvent('news-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      ${
        this.label
          ? html`
            <div part="header" class="header">
              <label part="label" class="label" for="slider">${this.label}</label>
              <span part="value" class="value">${this.value}</span>
            </div>
          `
          : nothing
      }
      <input
        id="slider"
        type="range"
        part="input"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${this.value}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        @input=${this._handleInput}
        @change=${this._handleChange}
      />
    `;
  }
}

customElements.define('news-slider', NewsSlider);

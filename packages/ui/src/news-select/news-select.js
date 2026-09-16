import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A dropdown select styled after the News UI newspaper design
 * system: a labeled, hairline-bordered field with a custom chevron, built
 * on a native `<select>` (native appearance suppressed, native dropdown
 * behavior kept). Same label/field/message shape as `news-input`.
 *
 * `<option>` elements can't be reliably slotted into a `<select>` living in
 * a Shadow DOM from light-DOM children across browsers, so options are
 * supplied as a JS property (`options`) rather than as slotted markup —
 * this component renders the actual `<option>` elements itself.
 *
 * A Form-Associated Custom Element: participates in native `<form>`
 * submission and constraint validation via `ElementInternals`, the same
 * way a real `<select>` would.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-select
 *
 * @csspart label - The `<label>` above the field.
 * @csspart field - The bordered wrapper around the select and chevron.
 * @csspart select - The native `<select>`.
 * @csspart chevron - The decorative dropdown icon.
 * @csspart message - The hint or error text below the field.
 *
 * @fires news-change - Dispatched when the selected value changes, `detail: { value }`.
 */
export class NewsSelect extends BaseElement {
  static formAssociated = true;

  static properties = {
    /** Visible label above the field. */
    label: { type: String },
    /** `{ value, label, disabled? }` objects rendered as `<option>` elements. */
    options: { type: Array },
    /** When set, renders a disabled placeholder option selected while `value` is empty. */
    placeholder: { type: String },
    value: { type: String },
    /** Helper text shown below the field when there's no error. */
    hint: { type: String },
    /** Error text shown below the field; also flags the field as invalid. */
    error: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
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

    label {
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-2xs, 0.625rem);
      font-weight: var(--news-font-weight-bold, 700);
      letter-spacing: var(--news-font-letter-spacing-wide, 0.1em);
      text-transform: uppercase;
      color: var(--news-color-text-primary);
    }

    .field {
      position: relative;
      display: flex;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      background-color: var(--news-color-surface-default);
      transition: border-color var(--news-motion-duration-fast, 150ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .field {
        transition: none;
      }
    }

    .field:focus-within {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    :host([error]) .field {
      border-color: var(--news-color-action-danger);
    }

    select {
      all: unset;
      box-sizing: border-box;
      appearance: none;
      flex: 1;
      min-width: 0;
      padding-block: var(--news-spacing-2, 0.5rem);
      padding-inline-start: var(--news-spacing-3, 0.75rem);
      padding-inline-end: var(--news-spacing-8, 2rem);
      font-family: var(--news-font-family-body);
      font-size: var(--news-font-size-sm, 0.875rem);
      color: var(--news-color-text-primary);
      background-color: transparent;
      cursor: pointer;
    }

    :host([disabled]) select {
      cursor: not-allowed;
    }

    .chevron {
      position: absolute;
      top: 50%;
      right: var(--news-spacing-3, 0.75rem);
      transform: translateY(-50%);
      display: flex;
      pointer-events: none;
      color: var(--news-color-text-muted);
    }

    .chevron svg {
      width: 0.625rem;
      height: 0.375rem;
    }

    /* ── Hint / error message below the field ────────────────────────── */
    .message {
      margin: 0;
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-2xs, 0.625rem);
      letter-spacing: var(--news-font-letter-spacing-wide, 0.1em);
    }

    .message.hint {
      color: var(--news-color-text-muted);
    }

    .message.error {
      color: var(--news-color-action-danger);
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.options = [];
    this.placeholder = '';
    this.value = '';
    this.hint = '';
    this.error = '';
    this.disabled = false;
    this.required = false;
    this.name = '';
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Captured once, on first connection, so formResetCallback can restore
    // whatever the author declared rather than always clearing to empty.
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
      this._internals.setFormValue(this.value);
    }
    if (
      changedProperties.has('value') ||
      changedProperties.has('options') ||
      changedProperties.has('placeholder')
    ) {
      // The <select>'s `<option>` children are rendered by this same
      // template, but Lit applies the `.value` property binding on the
      // opening tag before the child `<option>` content part commits — so
      // setting `.value` declaratively in the template can run against a
      // <select> that doesn't have its options yet, and the browser then
      // falls back to auto-selecting the first option once they exist.
      // Re-applying it here, after the DOM for this render is fully
      // patched, is what actually makes it stick.
      this._syncSelectValue();
    }
    if (
      changedProperties.has('value') ||
      changedProperties.has('required') ||
      changedProperties.has('error') ||
      changedProperties.has('options')
    ) {
      this._updateValidity();
    }
  }

  _syncSelectValue() {
    const select = this.renderRoot?.querySelector('select');
    if (!select) return;

    // Force a value whenever we have a real one, or a placeholder exists
    // (in which case forcing "" targets that placeholder option
    // directly). Setting `.value` to "" when NEITHER exists would
    // deselect everything (selectedIndex -1) instead of leaving the
    // native default — the first real option — in place, so skip it in
    // that case. Targeting the placeholder's value directly, rather than
    // relying on the browser's own default-selection algorithm, also
    // sidesteps a real engine difference: some engines skip a disabled
    // first option when picking a default and land on the first enabled
    // one instead.
    if (this.value || this.placeholder) {
      select.value = this.value;
    }

    // Adopt whatever the browser actually landed on — either because we
    // just set it above, or because it fell back to its native default.
    // Keeps `this.value` accurate to what's actually selected/submitted
    // instead of quietly drifting out of sync with the visible control.
    if (select.value !== this.value) {
      this.value = select.value;
    }
  }

  /**
   * Keeps ElementInternals' validity state in sync with either an explicit
   * `error` (a custom/server-side message the author supplies) or the
   * native `<select>`'s own constraint validation (required + an empty
   * `<option value="">` selected, via `placeholder`). An explicit `error`
   * always wins.
   */
  _updateValidity() {
    const select = this.renderRoot?.querySelector('select');
    if (!select) return;

    if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, select);
    } else if (!select.validity.valid) {
      this._internals.setValidity(select.validity, select.validationMessage, select);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this._defaultValue ?? '';
  }

  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state) {
    this.value = state ?? '';
  }

  _handleChange(event) {
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent('news-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const messageId = this.error || this.hint ? 'message' : nothing;

    return html`
      ${this.label ? html`<label part="label" for="select">${this.label}</label>` : nothing}

      <div part="field" class=${this.error ? 'field has-error' : 'field'}>
        <select
          id="select"
          part="select"
          .value=${this.value}
          name=${this.name || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${messageId}
          @change=${this._handleChange}
        >
          ${this.placeholder ? html`<option value="" disabled hidden>${this.placeholder}</option>` : nothing}
          ${this.options.map(
            (option) =>
              html`<option value=${option.value} ?disabled=${option.disabled}>
                ${option.label}
              </option>`,
          )}
        </select>
        <span class="chevron" part="chevron" aria-hidden="true">
          <svg viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>

      ${
        this.error
          ? html`<p id="message" part="message" class="message error">${this.error}</p>`
          : this.hint
            ? html`<p id="message" part="message" class="message hint">${this.hint}</p>`
            : nothing
      }
    `;
  }
}

customElements.define('news-select', NewsSelect);

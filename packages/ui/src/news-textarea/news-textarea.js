import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A multi-line text field styled after the News UI newspaper
 * design system: a labeled, hairline-bordered box with a hint or error
 * message underneath. Same shape as `news-input`, minus prefix/suffix,
 * built on a native `<textarea>`.
 *
 * A Form-Associated Custom Element: participates in native `<form>`
 * submission and constraint validation via `ElementInternals`, the same
 * way a real `<textarea>` would.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page — this
 * component reads color/type/spacing straight from those custom properties
 * and does not hardcode fallback colors.
 *
 * @tag news-textarea
 *
 * @csspart label - The `<label>` above the field.
 * @csspart textarea - The native `<textarea>`.
 * @csspart message - The hint or error text below the field.
 *
 * @fires news-input - Dispatched on every keystroke, `detail: { value }`.
 * @fires news-change - Dispatched when the value is committed (native `change`), `detail: { value }`.
 */
export class NewsTextarea extends BaseElement {
  static formAssociated = true;

  static properties = {
    /** Visible label above the field. */
    label: { type: String },
    value: { type: String },
    placeholder: { type: String },
    /** Helper text shown below the field when there's no error. */
    hint: { type: String },
    /** Error text shown below the field; also flags the field as invalid. */
    error: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    name: { type: String },
    /** Visible number of text lines. */
    rows: { type: Number },
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

    textarea {
      all: unset;
      box-sizing: border-box;
      display: block;
      width: 100%;
      padding-block: var(--news-spacing-2, 0.5rem);
      padding-inline: var(--news-spacing-3, 0.75rem);
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      background-color: var(--news-color-surface-default);
      color: var(--news-color-text-primary);
      font-family: var(--news-font-family-body);
      font-size: var(--news-font-size-sm, 0.875rem);
      line-height: var(--news-font-line-height-base, 1.5);
      resize: vertical;
      transition: border-color var(--news-motion-duration-fast, 150ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      textarea {
        transition: none;
      }
    }

    textarea::placeholder {
      color: var(--news-color-text-muted);
    }

    textarea:focus-visible {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    :host([error]) textarea {
      border-color: var(--news-color-action-danger);
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
    this.value = '';
    this.placeholder = '';
    this.hint = '';
    this.error = '';
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.rows = 4;
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Captured once, on first connection, so formResetCallback can restore
    // whatever the author declared rather than always clearing the field.
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
      changedProperties.has('required') ||
      changedProperties.has('error')
    ) {
      this._updateValidity();
    }
  }

  /**
   * Keeps ElementInternals' validity state in sync with either an explicit
   * `error` (a custom/server-side message the author supplies) or the
   * native `<textarea>`'s own constraint validation (required, etc). An
   * explicit `error` always wins.
   */
  _updateValidity() {
    const textarea = this.renderRoot?.querySelector('textarea');
    if (!textarea) return;

    if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, textarea);
    } else if (!textarea.validity.valid) {
      this._internals.setValidity(textarea.validity, textarea.validationMessage, textarea);
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

  _handleInput(event) {
    this.value = event.target.value;
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
    const messageId = this.error || this.hint ? 'message' : nothing;

    return html`
      ${this.label ? html`<label part="label" for="textarea">${this.label}</label>` : nothing}

      <textarea
        id="textarea"
        part="textarea"
        rows=${this.rows}
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${messageId}
        @input=${this._handleInput}
        @change=${this._handleChange}
      ></textarea>

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

customElements.define('news-textarea', NewsTextarea);

import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A text input styled after the News UI newspaper design system:
 * a labeled, hairline-bordered field with optional prefix/suffix text and a
 * hint or error message underneath.
 *
 * A Form-Associated Custom Element: it participates in native `<form>`
 * submission and constraint validation via `ElementInternals`, the same way
 * a real `<input>` would — no hidden mirror `<input>` in the light DOM, no
 * form-library glue required.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page — this
 * component reads color/type/spacing straight from those custom properties
 * and does not hardcode fallback colors.
 *
 * @tag news-input
 *
 * @csspart label - The `<label>` above the field.
 * @csspart field - The bordered wrapper around prefix/input/suffix.
 * @csspart prefix - The prefix text, when `prefix` is set.
 * @csspart input - The native `<input>` inside the field.
 * @csspart suffix - The suffix text, when `suffix` is set.
 * @csspart message - The hint or error text below the field.
 *
 * @fires news-input - Dispatched on every keystroke, `detail: { value }`.
 * @fires news-change - Dispatched when the value is committed (native `change`), `detail: { value }`.
 */
export class NewsInput extends BaseElement {
  /** Tells the browser this element behaves like a form control. */
  static formAssociated = true;

  static properties = {
    /** Visible label above the field. */
    label: { type: String },
    /** Native `<input>` type, e.g. "text", "email", "password". */
    type: { type: String },
    value: { type: String },
    placeholder: { type: String },
    /** Helper text shown below the field when there's no error. */
    hint: { type: String },
    /** Error text shown below the field; also flags the field as invalid. */
    error: { type: String },
    /** Short text shown before the input, inside the field's border. */
    prefix: { type: String },
    /** Short text shown after the input, inside the field's border. */
    suffix: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    name: { type: String },
  };

  static styles = css`
    /* The host itself is the vertical stack: label, field, message — a
       component-per-form-row, same as the reference design's wrapper div. */
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

    /* ── Field: the bordered row holding prefix / input / suffix ────────── */
    .field {
      display: flex;
      align-items: stretch;
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

    /* A visible focus indicator on the whole field, not just the <input> —
       there may be a prefix/suffix box next to it that should look part of
       the same focused control. */
    .field:focus-within {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    :host([error]) .field,
    .field.has-error {
      border-color: var(--news-color-action-danger);
    }

    .affix {
      display: flex;
      align-items: center;
      padding-inline: var(--news-spacing-3, 0.75rem);
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-sm, 0.75rem);
      color: var(--news-color-text-muted);
      background-color: var(--news-color-surface-raised);
      user-select: none;
      white-space: nowrap;
    }

    .affix[data-position='prefix'] {
      border-right: var(--news-border-width-hairline, 0.0625rem) solid
        var(--news-color-border-default);
    }

    .affix[data-position='suffix'] {
      border-left: var(--news-border-width-hairline, 0.0625rem) solid
        var(--news-color-border-default);
    }

    input {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      min-width: 0;
      padding-block: var(--news-spacing-2, 0.5rem);
      padding-inline: var(--news-spacing-3, 0.75rem);
      font-family: var(--news-font-family-body);
      font-size: var(--news-font-size-sm, 0.875rem);
      color: var(--news-color-text-primary);
      background-color: transparent;
    }

    input::placeholder {
      color: var(--news-color-text-muted);
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
    this.type = 'text';
    this.value = '';
    this.placeholder = '';
    this.hint = '';
    this.error = '';
    this.prefix = '';
    this.suffix = '';
    this.disabled = false;
    this.required = false;
    this.name = '';
    this._internals = this.attachInternals();
  }

  /** @returns {HTMLFormElement | null} The form this input is associated with, if any. */
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
   * native `<input>`'s own constraint validation (required, type=email,
   * pattern, etc). An explicit `error` always wins.
   */
  _updateValidity() {
    const input = this.renderRoot?.querySelector('input');
    if (!input) return;

    if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, input);
    } else if (!input.validity.valid) {
      this._internals.setValidity(input.validity, input.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = '';
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
      ${this.label ? html`<label part="label" for="input">${this.label}</label>` : nothing}

      <div part="field" class=${this.error ? 'field has-error' : 'field'}>
        ${
          this.prefix
            ? html`<span part="prefix" class="affix" data-position="prefix">${this.prefix}</span>`
            : nothing
        }
        <input
          id="input"
          part="input"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${messageId}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
        ${
          this.suffix
            ? html`<span part="suffix" class="affix" data-position="suffix">${this.suffix}</span>`
            : nothing
        }
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

customElements.define('news-input', NewsInput);

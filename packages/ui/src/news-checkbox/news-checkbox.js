import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A checkbox styled after the News UI newspaper design system: a
 * square hairline-bordered box that fills solid ink when checked, next to
 * a body-serif label.
 *
 * A Form-Associated Custom Element, like `news-input`: `static
 * formAssociated = true` plus `ElementInternals` let it participate in
 * native `<form>` submission and constraint validation the same way a real
 * `<input type="checkbox">` would.
 *
 * The real, focusable, clickable control is a native `<input
 * type="checkbox">` — visually hidden (opacity: 0) but positioned exactly
 * over the visible box, so mouse, keyboard, and screen-reader interaction
 * all target the native element. The box and its checkmark/dash are purely
 * decorative (`aria-hidden`).
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-checkbox
 *
 * @slot - The label content next to the box.
 *
 * @csspart label - The `<label>` wrapping the whole control.
 * @csspart input - The native, visually-hidden `<input type="checkbox">`.
 * @csspart box - The visible square box.
 * @csspart text - The wrapper around the slotted label content.
 *
 * @cssprop --news-checkbox-size - Width/height of the box. Defaults to 1rem.
 *
 * @fires news-change - Dispatched when the checked state changes, `detail: { checked }`.
 */
export class NewsCheckbox extends BaseElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    /** Visually shows a "mixed" dash instead of checked/unchecked. Presentational only — doesn't affect form value or validity, matching native `<input>` behavior. */
    indeterminate: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    name: { type: String },
    /** Value submitted with the form when checked. Defaults to "on", matching a native checkbox. */
    value: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([disabled]) {
      opacity: 0.4;
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--news-spacing-2, 0.5rem);
      cursor: pointer;
      user-select: none;
    }

    :host([disabled]) label {
      cursor: not-allowed;
    }

    .control {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
      width: var(--news-checkbox-size, 1rem);
      height: var(--news-checkbox-size, 1rem);
    }

    /* The real interactive element. Sized and positioned exactly over the
       visible box, so the click/focus target lines up with what's drawn,
       but invisible itself — the box beneath is what's actually seen. */
    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      background-color: var(--news-color-surface-default);
      transition:
        background-color var(--news-motion-duration-fast, 150ms) ease,
        border-color var(--news-motion-duration-fast, 150ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .box {
        transition: none;
      }
    }

    input:focus-visible + .box {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    :host([checked]) .box {
      background-color: var(--news-color-action-primary);
      border-color: var(--news-color-action-primary);
    }

    .icon {
      width: 60%;
      height: 60%;
      color: var(--news-color-text-inverse);
    }

    .dash {
      width: 50%;
      height: 0.125rem;
      background-color: var(--news-color-text-inverse);
    }

    .text {
      font-family: var(--news-font-family-body);
      font-size: var(--news-font-size-sm, 0.875rem);
      color: var(--news-color-text-primary);
    }
  `;

  constructor() {
    super();
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = 'on';
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Captured once, on first connection, so formResetCallback can restore
    // whatever the author declared (e.g. `<news-checkbox checked>`) rather
    // than always resetting to unchecked.
    if (this._defaultChecked === undefined) {
      this._defaultChecked = this.checked;
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
    if (changedProperties.has('checked')) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
    if (changedProperties.has('checked') || changedProperties.has('required')) {
      this._updateValidity();
    }
    if (changedProperties.has('indeterminate')) {
      this._syncIndeterminate();
    }
  }

  firstUpdated() {
    this._syncIndeterminate();
  }

  /**
   * `indeterminate` is a DOM property on `<input>`, not a content
   * attribute — there's no template binding for it, so it has to be set
   * imperatively after every render that could affect it.
   */
  _syncIndeterminate() {
    const input = this.renderRoot?.querySelector('input');
    if (input) input.indeterminate = this.indeterminate;
  }

  _updateValidity() {
    const input = this.renderRoot?.querySelector('input');
    if (!input) return;

    if (!input.validity.valid) {
      this._internals.setValidity(input.validity, input.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.checked = this._defaultChecked ?? false;
  }

  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state) {
    this.checked = state === this.value;
  }

  _handleChange(event) {
    this.checked = event.target.checked;
    // Matches native behavior: interacting with an indeterminate checkbox
    // resolves it to a definite checked/unchecked state.
    this.indeterminate = false;
    this.dispatchEvent(
      new CustomEvent('news-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <label part="label">
        <span class="control">
          <input
            type="checkbox"
            part="input"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name || nothing}
            @change=${this._handleChange}
          />
          <span class="box" part="box" aria-hidden="true">
            ${
              this.indeterminate
                ? html`<span class="dash"></span>`
                : this.checked
                  ? html`<svg class="icon" viewBox="0 0 9 7" fill="none">
                      <path
                        d="M1 3.5L3.5 6 8 1"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>`
                  : nothing
            }
          </span>
        </span>
        <span part="text" class="text"><slot></slot></span>
      </label>
    `;
  }
}

customElements.define('news-checkbox', NewsCheckbox);

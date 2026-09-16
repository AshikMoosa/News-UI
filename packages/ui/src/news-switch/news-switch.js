import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A toggle switch styled after the News UI newspaper design
 * system: a hairline-bordered track that fills solid ink when on, with a
 * sliding thumb. Same underlying mechanics as `news-checkbox` — a
 * two-state, form-participating control — with `role="switch"` so
 * assistive tech announces it as a switch (on/off) rather than a checkbox
 * (checked/unchecked), per the WAI-ARIA switch pattern.
 *
 * A Form-Associated Custom Element: `static formAssociated = true` plus
 * `ElementInternals` let it participate in native `<form>` submission and
 * constraint validation. The real, focusable, clickable control is a
 * native `<input type="checkbox" role="switch">`, visually hidden but
 * positioned exactly over the visible track, so mouse/keyboard/AT
 * interaction all target the native element.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-switch
 *
 * @slot - The label content next to the switch.
 *
 * @csspart label - The `<label>` wrapping the whole control.
 * @csspart input - The native, visually-hidden `<input type="checkbox">`.
 * @csspart track - The square track.
 * @csspart thumb - The sliding thumb.
 * @csspart text - The wrapper around the slotted label content.
 *
 * @cssprop --news-switch-track-width - Track width. Defaults to 2.25rem (md) / 1.75rem (sm).
 * @cssprop --news-switch-track-height - Track height. Defaults to 1.25rem (md) / 0.875rem (sm).
 * @cssprop --news-switch-thumb-size - Thumb diameter. Defaults to 0.875rem (md) / 0.625rem (sm).
 *
 * @fires news-change - Dispatched when the checked state changes, `detail: { checked }`.
 */
export class NewsSwitch extends BaseElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    name: { type: String },
    /** Value submitted with the form when checked. Defaults to "on", matching a native checkbox. */
    value: { type: String },
    /** "sm" or "md" (default). */
    size: { type: String, reflect: true },
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
      width: var(--news-switch-track-width, 2.25rem);
      height: var(--news-switch-track-height, 1.25rem);
    }

    :host([size='sm']) .control {
      width: var(--news-switch-track-width, 1.75rem);
      height: var(--news-switch-track-height, 0.875rem);
    }

    /* The real interactive element, invisible but positioned exactly over
       the visible track — same technique as news-checkbox. */
    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .track {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      border-radius: var(--news-radius-none, 0);
      background-color: var(--news-color-surface-raised);
      transition:
        background-color var(--news-motion-duration-base, 200ms) ease,
        border-color var(--news-motion-duration-base, 200ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }

    input:focus-visible + .track {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    :host([checked]) .track {
      background-color: var(--news-color-action-primary);
      border-color: var(--news-color-action-primary);
    }

    .thumb {
      position: absolute;
      top: 50%;
      left: 0.125rem;
      width: var(--news-switch-thumb-size, 0.875rem);
      height: var(--news-switch-thumb-size, 0.875rem);
      border-radius: var(--news-radius-none, 0);
      background-color: var(--news-color-text-muted);
      transform: translateY(-50%);
      transition:
        transform var(--news-motion-duration-base, 200ms) ease,
        background-color var(--news-motion-duration-base, 200ms) ease;
    }

    :host([size='sm']) .thumb {
      width: var(--news-switch-thumb-size, 0.625rem);
    }

    /* Travel distance = track width - thumb size - (2 * left inset). */
    :host([checked]) .thumb {
      background-color: var(--news-color-text-inverse);
      transform: translateY(-50%) translateX(1.125rem);
    }

    :host([checked][size='sm']) .thumb {
      transform: translateY(-50%) translateX(0.875rem);
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
    this.disabled = false;
    this.required = false;
    this.name = '';
    this.value = 'on';
    this.size = 'md';
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Captured once, on first connection, so formResetCallback can restore
    // whatever the author declared (e.g. `<news-switch checked>`) rather
    // than always resetting to off.
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
            role="switch"
            part="input"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name || nothing}
            @change=${this._handleChange}
          />
          <span class="track" part="track" aria-hidden="true"></span>
          <span class="thumb" part="thumb" aria-hidden="true"></span>
        </span>
        <span part="text" class="text"><slot></slot></span>
      </label>
    `;
  }
}

customElements.define('news-switch', NewsSwitch);

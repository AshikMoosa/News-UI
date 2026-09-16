import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A group of `news-radio` options with exactly one selectable at a
 * time — the Form-Associated Custom Element that owns the group's value,
 * validity, and keyboard navigation. `news-radio` children are presentational
 * only; this component is what actually participates in `<form>` submission.
 *
 * Implements the WAI-ARIA "radio group" composite-widget pattern: a single
 * roving `tabindex` across the slotted `news-radio` children (only the
 * selected — or first enabled — option is in the Tab order), and Arrow
 * key navigation that moves focus **and** selection together, matching how
 * native `<input type="radio">` groups behave. This is done manually
 * because native radio mutual-exclusion via a shared `name` only works
 * within a single DOM tree — it does not reach across the separate Shadow
 * DOM trees each `news-radio` has.
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-radio-group
 *
 * @slot - One or more `news-radio` elements.
 *
 * @csspart label - The group's visible label, when `label` is set.
 * @csspart options - The wrapper around the slotted `news-radio` options.
 *
 * @fires news-change - Dispatched when the selected value changes, `detail: { value }`.
 */
export class NewsRadioGroup extends BaseElement {
  static formAssociated = true;

  static properties = {
    /** Visible label above the group. Also used as the group's accessible name (`aria-label`) — a shadow-DOM `aria-labelledby` can't reach across into slotted content's tree. */
    label: { type: String },
    value: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean },
    name: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--news-spacing-2, 0.5rem);
    }

    :host([disabled]) {
      opacity: 0.4;
      pointer-events: none;
    }

    .label {
      font-family: var(--news-font-family-mono);
      font-size: var(--news-font-label-size-2xs, 0.625rem);
      font-weight: var(--news-font-weight-bold, 700);
      letter-spacing: var(--news-font-letter-spacing-wide, 0.1em);
      text-transform: uppercase;
      color: var(--news-color-text-primary);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: var(--news-spacing-2, 0.5rem);
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.disabled = false;
    this.required = false;
    this.name = '';
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'radiogroup');
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
    if (changedProperties.has('label')) {
      if (this.label) {
        this.setAttribute('aria-label', this.label);
      } else {
        this.removeAttribute('aria-label');
      }
    }
    if (changedProperties.has('value')) {
      this._internals.setFormValue(this.value || null);
    }
    if (changedProperties.has('value') || changedProperties.has('required')) {
      this._updateValidity();
    }
    if (changedProperties.has('value') || changedProperties.has('disabled')) {
      this._syncChildren();
    }
  }

  _radios() {
    const slot = this.renderRoot?.querySelector('slot');
    if (!slot) return [];
    return slot.assignedElements({ flatten: true }).filter((el) => el.localName === 'news-radio');
  }

  /** Pushes checked state and roving tabindex down to every slotted `news-radio`. */
  _syncChildren() {
    const radios = this._radios();
    const checkedEnabled = radios.find((radio) => radio.value === this.value && !radio.disabled);
    const firstEnabled = radios.find((radio) => !radio.disabled);
    const activeRadio = this.disabled ? null : (checkedEnabled ?? firstEnabled);

    for (const radio of radios) {
      radio.checked = radio.value === this.value;
      radio.tabIndex = radio === activeRadio ? 0 : -1;
    }
  }

  _updateValidity() {
    if (this.required && !this.value) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please select an option.',
        this._radios()[0],
      );
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

  _selectValue(value) {
    if (this.disabled || this.value === value) return;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('news-change', { detail: { value }, bubbles: true, composed: true }),
    );
  }

  _handleSlotChange() {
    this._syncChildren();
  }

  _handleSelect(event) {
    this._selectValue(event.detail.value);
  }

  _handleKeydown(event) {
    const directions = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const delta = directions[event.key];
    if (!delta || this.disabled) return;
    event.preventDefault();

    const radios = this._radios().filter((radio) => !radio.disabled);
    if (radios.length === 0) return;

    // The keydown originates on whichever news-radio host currently has
    // focus; composedPath (not event.target) gives that reliably even
    // though the event crosses from the light-DOM child into this
    // component's shadow tree via the slot.
    const focused = event.composedPath()[0];
    const currentIndex = radios.indexOf(focused);
    const fromIndex = currentIndex === -1 ? 0 : currentIndex;
    const next = radios[(fromIndex + delta + radios.length) % radios.length];

    next.focus();
    this._selectValue(next.value);
  }

  render() {
    return html`
      ${this.label ? html`<span part="label" class="label">${this.label}</span>` : nothing}
      <div
        class="options"
        part="options"
        @slotchange=${this._handleSlotChange}
        @news-radio-select=${this._handleSelect}
        @keydown=${this._handleKeydown}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('news-radio-group', NewsRadioGroup);

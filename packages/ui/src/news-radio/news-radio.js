import { html, css, nothing } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary One option inside a `news-radio-group`: a round hairline ring
 * that fills with a solid ink dot when selected.
 *
 * Deliberately **not** a Form-Associated Custom Element itself, and does
 * not render a native `<input type="radio">`. Native radio mutual-exclusion
 * (same `name` → only one checked) only works within a single DOM tree —
 * it does not reach across separate Shadow DOM trees, so nesting a native
 * radio input per component would not actually group them. Instead this
 * is a plain ARIA composite-widget radio (`role="radio"`, `aria-checked`,
 * roving `tabindex`), coordinated entirely by its parent `news-radio-group`
 * (see that component for the group-level `formAssociated`/`ElementInternals`
 * logic, selection, and arrow-key navigation).
 *
 * Requires `@news-ui/tokens`'s CSS to be loaded on the page.
 *
 * @tag news-radio
 *
 * @slot - The label content next to the ring.
 *
 * @csspart ring - The round outer ring.
 * @csspart dot - The inner filled dot, present only when checked.
 * @csspart text - The wrapper around the slotted label content.
 *
 * @fires news-radio-select - Dispatched when a user selects this option (click, Space, or Enter). Caught by the parent `news-radio-group`, which owns the actual selection state.
 */
export class NewsRadio extends BaseElement {
  static properties = {
    value: { type: String },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([disabled]) {
      opacity: 0.4;
    }

    .wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--news-spacing-2, 0.5rem);
      cursor: pointer;
      user-select: none;
      outline: none;
    }

    :host([disabled]) .wrapper {
      cursor: not-allowed;
    }

    :host(:focus-visible) .ring {
      outline: var(--news-border-width-hairline, 0.0625rem) solid var(--news-color-border-default);
      outline-offset: 0.1875rem;
    }

    .ring {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--news-radio-size, 1rem);
      height: var(--news-radio-size, 1rem);
      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-color: var(--news-color-border-default);
      border-radius: var(--news-radius-full, 999px);
      background-color: var(--news-color-surface-default);
      transition: border-color var(--news-motion-duration-fast, 150ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .ring {
        transition: none;
      }
    }

    :host([checked]) .ring {
      border-color: var(--news-color-action-primary);
    }

    .dot {
      width: 50%;
      height: 50%;
      border-radius: var(--news-radius-full, 999px);
      background-color: var(--news-color-action-primary);
    }

    .text {
      font-family: var(--news-font-family-body);
      font-size: var(--news-font-size-sm, 0.875rem);
      color: var(--news-color-text-primary);
    }
  `;

  constructor() {
    super();
    this.value = '';
    this.checked = false;
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'radio');
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = -1;
    }
    // Keyboard focus lands on the host (that's what tabIndex above puts in
    // the tab order), so the keydown listener has to live on the host too
    // — a listener inside the shadow-DOM template would never see it, since
    // keydown bubbles up from whatever element is actually focused.
    this.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeydown);
  }

  updated(changedProperties) {
    if (changedProperties.has('checked')) {
      this.setAttribute('aria-checked', String(this.checked));
    }
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  select() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('news-radio-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleClick() {
    this.select();
  }

  _handleKeydown(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.select();
    }
  }

  render() {
    return html`
      <div class="wrapper" @click=${this._handleClick}>
        <span class="ring" part="ring">
          ${this.checked ? html`<span class="dot" part="dot"></span>` : nothing}
        </span>
        <span part="text" class="text"><slot></slot></span>
      </div>
    `;
  }
}

customElements.define('news-radio', NewsRadio);

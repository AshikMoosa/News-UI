import { html, css } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A button with primary, secondary, and ghost variants.
 *
 * @tag news-button
 *
 * @slot - Default slot for the button's label content.
 *
 * @csspart button - The native `<button>` rendered inside the shadow root.
 *
 * @cssprop --news-button-radius - Corner radius. Falls back to the `--news-radius-md` token.
 * @cssprop --news-button-padding-block - Vertical padding. Falls back to `--news-spacing-2`.
 * @cssprop --news-button-padding-inline - Horizontal padding. Falls back to `--news-spacing-4`.
 *
 * @fires news-click - Dispatched when the button is activated, unless disabled.
 */
export class NewsButton extends BaseElement {
  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    type: { type: String },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    button {
      font: inherit;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: var(--news-button-radius, var(--news-radius-md, 8px));
      padding-block: var(--news-button-padding-block, var(--news-spacing-2, 8px));
      padding-inline: var(--news-button-padding-inline, var(--news-spacing-4, 16px));
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-color 150ms ease;
    }

    :host([disabled]) button {
      cursor: not-allowed;
      opacity: 0.5;
    }

    button:focus-visible {
      outline: 2px solid var(--news-color-action-primary, #2f5eff);
      outline-offset: 2px;
    }

    :host(:not([variant])) button,
    :host([variant='secondary']) button {
      background-color: var(--news-color-surface-raised, #f4f5f7);
      color: var(--news-color-text-primary, #12141a);
      border-color: var(--news-color-border-default, #e2e4e9);
    }

    :host([variant='primary']) button {
      background-color: var(--news-color-action-primary, #2f5eff);
      color: var(--news-color-text-inverse, #ffffff);
    }

    :host([variant='primary']) button:hover {
      background-color: var(--news-color-action-primary-hover, #1f46d1);
    }

    :host([variant='ghost']) button {
      background-color: transparent;
      color: var(--news-color-action-primary, #2f5eff);
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.disabled = false;
    this.type = 'button';
  }

  render() {
    return html`
      <button
        part="button"
        type=${this.type}
        ?disabled=${this.disabled}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick(event) {
    if (this.disabled) {
      event.stopImmediatePropagation();
      return;
    }
    this.dispatchEvent(new CustomEvent('news-click', { bubbles: true, composed: true }));
  }
}

customElements.define('news-button', NewsButton);

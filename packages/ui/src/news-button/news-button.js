import { html, css } from 'lit';
import { BaseElement } from '../base-element.js';

/**
 * @summary A button styled after the News UI "classic newspaper" design
 * system: flat corners, a hairline ink border, and an uppercase monospace
 * label — the same visual language used for bylines and section labels
 * throughout the system.
 *
 * Requires `@news-ui/tokens`'s CSS (`tokens.css` + `tokens.dark.css`) to be
 * loaded on the page — this component reads color/type/spacing straight
 * from those custom properties and does not hardcode fallback colors.
 *
 * @tag news-button
 *
 * @slot - Default slot for the button's label content.
 *
 * @csspart button - The native `<button>` rendered inside the shadow root.
 *
 * @cssprop --news-button-radius - Corner radius. Defaults to `--news-radius-none` (flat).
 * @cssprop --news-button-padding-block - Vertical padding. Defaults to the size's spacing token.
 * @cssprop --news-button-padding-inline - Horizontal padding. Defaults to the size's spacing token.
 *
 * @fires news-click - Dispatched when the button is activated, unless disabled.
 */
export class NewsButton extends BaseElement {
  static properties = {
    /** Visual style. One of: primary, secondary, outline, ghost, danger. */
    variant: { type: String, reflect: true },
    /** Size. One of: xs, sm, md, lg. */
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    type: { type: String },
  };

  static styles = css`
    /* ── Host: layout only, no visual styling lives here ──────────────────
       Buttons participate in flex/grid layouts written by the consumer, so
       the host itself just behaves like an inline flex item. All paint
       (border, colors, type) is on the internal <button> so it stays
       encapsulated in the shadow root and only reachable via ::part. */
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    /* ── Base button shape ─────────────────────────────────────────────── */
    button {
      /* Reset user-agent button styling, then rebuild only what we need. */
      all: unset;
      box-sizing: border-box;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;

      cursor: pointer;
      user-select: none;
      white-space: nowrap;

      border-style: solid;
      border-width: var(--news-border-width-hairline, 0.0625rem);
      border-radius: var(--news-button-radius, var(--news-radius-none, 0));

      /* Every button label is uppercase monospace, matching bylines and
         section labels elsewhere in the system — this is the system's
         signature "chrome text" treatment, not a one-off button choice. */
      font-family: var(--news-font-family-mono, monospace);
      font-weight: var(--news-font-weight-regular, 400);
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: var(--news-font-letter-spacing-wide, 0.1em);

      transition:
        background-color var(--news-motion-duration-fast, 150ms) ease,
        color var(--news-motion-duration-fast, 150ms) ease,
        border-color var(--news-motion-duration-fast, 150ms) ease;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }

    button:focus-visible {
      outline: var(--news-border-width-hairline, 0.0625rem) solid
        var(--news-color-border-default, currentColor);
      outline-offset: 0.1875rem;
    }

    :host([disabled]) button {
      cursor: not-allowed;
      opacity: 0.4;
    }

    /* ── Sizes ──────────────────────────────────────────────────────────
       Padding/font-size are read from the design system's spacing and
       label-size scales — never a hardcoded pixel value — so resizing the
       root font (user zoom, accessibility settings) scales the button too. */
    :host(:not([size])) button,
    :host([size='md']) button {
      padding-block: var(--news-button-padding-block, var(--news-spacing-2, 0.5rem));
      padding-inline: var(--news-button-padding-inline, var(--news-spacing-6, 1.5rem));
      font-size: var(--news-font-label-size-sm, 0.75rem);
    }

    :host([size='xs']) button {
      padding-block: var(--news-button-padding-block, var(--news-spacing-1, 0.25rem));
      padding-inline: var(--news-button-padding-inline, var(--news-spacing-3, 0.75rem));
      font-size: var(--news-font-label-size-2xs, 0.625rem);
    }

    :host([size='sm']) button {
      padding-block: var(--news-button-padding-block, var(--news-spacing-2, 0.5rem));
      padding-inline: var(--news-button-padding-inline, var(--news-spacing-4, 1rem));
      font-size: var(--news-font-label-size-xs, 0.6875rem);
    }

    :host([size='lg']) button {
      padding-block: var(--news-button-padding-block, var(--news-spacing-3, 0.75rem));
      padding-inline: var(--news-button-padding-inline, var(--news-spacing-8, 2rem));
      font-size: var(--news-font-label-size-md, 0.8125rem);
    }

    /* ── Variants ───────────────────────────────────────────────────────
       Each variant only sets background/text/border color plus a hover and
       an active shade — layout and type never change between variants. */
    :host(:not([variant])) button,
    :host([variant='primary']) button {
      background-color: var(--news-color-action-primary);
      color: var(--news-color-text-inverse);
      border-color: var(--news-color-action-primary);
    }

    :host(:not([variant])) button:hover,
    :host([variant='primary']) button:hover {
      background-color: var(--news-color-action-primary-hover);
      border-color: var(--news-color-action-primary-hover);
    }

    :host(:not([variant])) button:active,
    :host([variant='primary']) button:active {
      background-color: var(--news-color-action-primary-active);
      border-color: var(--news-color-action-primary-active);
    }

    :host([variant='secondary']) button {
      background-color: var(--news-color-surface-raised);
      color: var(--news-color-text-primary);
      border-color: var(--news-color-border-default);
    }

    :host([variant='secondary']) button:hover,
    :host([variant='secondary']) button:active {
      background-color: var(--news-color-surface-muted);
    }

    :host([variant='outline']) button {
      background-color: transparent;
      color: var(--news-color-text-primary);
      border-color: var(--news-color-border-default);
    }

    :host([variant='outline']) button:hover,
    :host([variant='outline']) button:active {
      background-color: var(--news-color-surface-raised);
    }

    :host([variant='ghost']) button {
      background-color: transparent;
      color: var(--news-color-text-primary);
      border-color: transparent;
    }

    :host([variant='ghost']) button:hover {
      background-color: var(--news-color-surface-raised);
    }

    :host([variant='ghost']) button:active {
      background-color: var(--news-color-surface-muted);
    }

    :host([variant='danger']) button {
      background-color: var(--news-color-action-danger);
      color: var(--news-color-text-inverse);
      border-color: var(--news-color-action-danger);
    }

    :host([variant='danger']) button:hover {
      background-color: var(--news-color-action-danger-hover);
      border-color: var(--news-color-action-danger-hover);
    }

    :host([variant='danger']) button:active {
      background-color: var(--news-color-action-danger-active);
      border-color: var(--news-color-action-danger-active);
    }
  `;

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
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

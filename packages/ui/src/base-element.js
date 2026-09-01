import { LitElement } from 'lit';

/**
 * Shared base class for every News UI component. Centralizes the a11y
 * plumbing every component needs so individual components don't reimplement
 * focus-visible tracking and reduced-motion detection.
 */
export class BaseElement extends LitElement {
  static properties = {
    _focusVisible: { state: true },
  };

  constructor() {
    super();
    this._focusVisible = false;
    this._reducedMotionQuery =
      typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  }

  get prefersReducedMotion() {
    return this._reducedMotionQuery?.matches ?? false;
  }

  _handleFocus() {
    try {
      this._focusVisible = this.matches(':focus-visible');
    } catch {
      this._focusVisible = true;
    }
  }

  _handleBlur() {
    this._focusVisible = false;
  }
}

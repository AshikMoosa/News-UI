import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-input.js';

describe('news-input', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-input');
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a native input in its shadow root, defaulting to type text', () => {
    const input = el.shadowRoot.querySelector('input');
    expect(input).toBeTruthy();
    expect(input.type).toBe('text');
  });

  it('omits the label element when unset', () => {
    expect(el.shadowRoot.querySelector('label')).toBeNull();
  });

  it('renders the label, wired to the input via for/id', async () => {
    el.label = 'Email address';
    await el.updateComplete;
    const label = el.shadowRoot.querySelector('label');
    expect(label.textContent.trim()).toBe('Email address');
    expect(label.getAttribute('for')).toBe('input');
  });

  it('updates value and dispatches news-input on keystrokes', () => {
    const handler = vi.fn();
    el.addEventListener('news-input', handler);
    const input = el.shadowRoot.querySelector('input');
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(el.value).toBe('hello');
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'hello' });
  });

  it('dispatches news-change on native change', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    el.shadowRoot.querySelector('input').dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('shows the hint message when there is no error', async () => {
    el.hint = 'We will never share this.';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('We will never share this.');
    expect(message.classList.contains('hint')).toBe(true);
  });

  it('shows the error message instead of the hint when both are set', async () => {
    el.hint = 'Hint text';
    el.error = 'Required field';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('Required field');
    expect(message.classList.contains('error')).toBe(true);
  });

  it('reflects error state to aria-invalid on the native input', async () => {
    expect(el.shadowRoot.querySelector('input').getAttribute('aria-invalid')).toBe('false');
    el.error = 'Invalid';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('renders prefix and suffix text inside the field border', async () => {
    el.prefix = '$';
    el.suffix = 'USD';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[part="prefix"]').textContent.trim()).toBe('$');
    expect(el.shadowRoot.querySelector('[part="suffix"]').textContent.trim()).toBe('USD');
  });
});

describe('news-input form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-input');
    el.name = 'email';
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
  });

  afterEach(() => {
    form.remove();
  });

  it('declares itself form-associated', () => {
    expect(el.constructor.formAssociated).toBe(true);
  });

  it('is associated with its enclosing form', () => {
    expect(el.form).toBe(form);
  });

  it('is invalid when required and empty, valid once filled in', async () => {
    el.required = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);

    el.value = 'reader@example.com';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('is invalid with a custom error even when the native input is otherwise valid', async () => {
    el.value = 'reader@example.com';
    el.error = 'This email is already registered';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe('This email is already registered');
  });

  it('clears its value when the browser invokes formResetCallback', async () => {
    // jsdom doesn't yet wire real <form> submission/reset to
    // form-associated custom elements (it never calls this lifecycle
    // callback itself), so we invoke it directly — every real browser
    // guarantees the call happens on form.reset(); that contract is the
    // browser's responsibility, not this component's.
    el.value = 'reader@example.com';
    await el.updateComplete;
    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe('');
  });
});

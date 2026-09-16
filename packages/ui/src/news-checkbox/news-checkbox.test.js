import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-checkbox.js';

describe('news-checkbox', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-checkbox');
    el.textContent = 'Accept terms';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders an unchecked native checkbox by default', () => {
    const input = el.shadowRoot.querySelector('input');
    expect(input.type).toBe('checkbox');
    expect(input.checked).toBe(false);
    expect(el.checked).toBe(false);
  });

  it('defaults value to "on", matching a native checkbox', () => {
    expect(el.value).toBe('on');
  });

  it('reflects checked to the host attribute and shows a checkmark', async () => {
    el.checked = true;
    await el.updateComplete;
    expect(el.hasAttribute('checked')).toBe(true);
    expect(el.shadowRoot.querySelector('.icon')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.dash')).toBeNull();
  });

  it('shows a dash, not a checkmark, when indeterminate', async () => {
    el.checked = true;
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input').indeterminate).toBe(true);
    expect(el.shadowRoot.querySelector('.dash')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.icon')).toBeNull();
  });

  it('toggles checked and dispatches news-change on click', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    el.shadowRoot.querySelector('input').click();
    expect(el.checked).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ checked: true });
  });

  it('resolves indeterminate to a definite state on interaction', async () => {
    el.indeterminate = true;
    await el.updateComplete;
    el.shadowRoot.querySelector('input').click();
    await el.updateComplete;
    expect(el.indeterminate).toBe(false);
    expect(el.checked).toBe(true);
  });
});

describe('news-checkbox form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-checkbox');
    el.name = 'terms';
    el.textContent = 'Accept terms';
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

  it('is invalid when required and unchecked, valid once checked', async () => {
    el.required = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);

    el.checked = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('restores its default (declared) checked state on form reset', async () => {
    // Simulates `<news-checkbox checked>` — connectedCallback captures
    // whatever `checked` already was at first connection as the default.
    el._defaultChecked = true;
    el.checked = false;
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-switch.js';

describe('news-switch', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-switch');
    el.textContent = 'Enable notifications';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders an off native checkbox with role="switch" by default', () => {
    const input = el.shadowRoot.querySelector('input');
    expect(input.type).toBe('checkbox');
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.checked).toBe(false);
    expect(el.checked).toBe(false);
  });

  it('defaults to size "md" and value "on"', () => {
    expect(el.size).toBe('md');
    expect(el.value).toBe('on');
  });

  it('reflects checked and size to host attributes', async () => {
    el.checked = true;
    el.size = 'sm';
    await el.updateComplete;
    expect(el.hasAttribute('checked')).toBe(true);
    expect(el.getAttribute('size')).toBe('sm');
  });

  it('toggles checked and dispatches news-change on click', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    el.shadowRoot.querySelector('input').click();
    expect(el.checked).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ checked: true });
  });

  it('reflects the disabled property to the native input', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input').disabled).toBe(true);
  });
});

describe('news-switch form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-switch');
    el.name = 'notifications';
    el.textContent = 'Enable notifications';
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

  it('is invalid when required and off, valid once on', async () => {
    el.required = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);

    el.checked = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('restores its default (declared) checked state on form reset', async () => {
    el._defaultChecked = true;
    el.checked = false;
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });
});

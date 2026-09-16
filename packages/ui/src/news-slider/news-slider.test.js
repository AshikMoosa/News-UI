import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-slider.js';

describe('news-slider', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-slider');
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a native range input, defaulting to min 0, max 100, value 0', () => {
    const input = el.shadowRoot.querySelector('input');
    expect(input.type).toBe('range');
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.value).toBe('0');
  });

  it('omits the header row when there is no label', () => {
    expect(el.shadowRoot.querySelector('.header')).toBeNull();
  });

  it('shows the label and the live value together when label is set', async () => {
    el.label = 'Font size';
    el.value = 42;
    await el.updateComplete;
    const label = el.shadowRoot.querySelector('.label');
    const value = el.shadowRoot.querySelector('.value');
    expect(label.textContent.trim()).toBe('Font size');
    expect(value.textContent.trim()).toBe('42');
  });

  it('respects custom min/max/step', async () => {
    el.min = 10;
    el.max = 20;
    el.step = 5;
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input');
    expect(input.min).toBe('10');
    expect(input.max).toBe('20');
    expect(input.step).toBe('5');
  });

  it('updates value and dispatches news-input while dragging', () => {
    const handler = vi.fn();
    el.addEventListener('news-input', handler);
    const input = el.shadowRoot.querySelector('input');
    input.value = '60';
    input.dispatchEvent(new Event('input'));
    expect(el.value).toBe(60);
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 60 });
  });

  it('dispatches news-change on release (native change)', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    el.shadowRoot.querySelector('input').dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('reflects the disabled property to the native input', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input').disabled).toBe(true);
  });
});

describe('news-slider form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-slider');
    el.name = 'volume';
    el.value = 30;
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

  it('restores its default (declared) value on formResetCallback', async () => {
    el._defaultValue = 30;
    el.value = 75;
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe(30);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-radio-group.js';
import '../news-radio/news-radio.js';

/** Builds a group with three options: print, digital, both. */
function buildGroup({ value, disabled, required } = {}) {
  const group = document.createElement('news-radio-group');
  group.name = 'delivery';
  if (value !== undefined) group.value = value;
  if (disabled) group.disabled = true;
  if (required) group.required = true;

  const options = [
    ['print', 'Print'],
    ['digital', 'Digital'],
    ['both', 'Both'],
  ];
  for (const [val, label] of options) {
    const radio = document.createElement('news-radio');
    radio.value = val;
    radio.textContent = label;
    group.appendChild(radio);
  }
  return group;
}

describe('news-radio-group', () => {
  let group;
  let radios;

  beforeEach(async () => {
    group = buildGroup({ value: 'digital' });
    document.body.appendChild(group);
    await group.updateComplete;
    // Let slotchange + child updates settle.
    await new Promise((resolve) => setTimeout(resolve, 0));
    radios = [...group.querySelectorAll('news-radio')];
  });

  afterEach(() => {
    group.remove();
  });

  it('sets role="radiogroup" on the host', () => {
    expect(group.getAttribute('role')).toBe('radiogroup');
  });

  it('marks only the radio matching value as checked', () => {
    expect(radios.map((r) => r.checked)).toEqual([false, true, false]);
  });

  it('gives only the checked radio tabindex 0, the rest -1', () => {
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('defaults the first enabled radio to tabindex 0 when nothing is selected', async () => {
    const empty = buildGroup();
    document.body.appendChild(empty);
    await empty.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    const emptyRadios = [...empty.querySelectorAll('news-radio')];
    expect(emptyRadios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
    empty.remove();
  });

  it('updates value and re-syncs children when a child dispatches news-radio-select', async () => {
    radios[0].dispatchEvent(
      new CustomEvent('news-radio-select', {
        detail: { value: 'print' },
        bubbles: true,
        composed: true,
      }),
    );
    await group.updateComplete;
    expect(group.value).toBe('print');
    expect(radios.map((r) => r.checked)).toEqual([true, false, false]);
    expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1]);
  });

  it('dispatches news-change when the value changes', () => {
    const handler = vi.fn();
    group.addEventListener('news-change', handler);
    radios[2].dispatchEvent(
      new CustomEvent('news-radio-select', {
        detail: { value: 'both' },
        bubbles: true,
        composed: true,
      }),
    );
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'both' });
  });

  it('moves focus and selection to the next option on ArrowDown', async () => {
    radios[1].focus();
    radios[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }),
    );
    await group.updateComplete;
    expect(group.value).toBe('both');
    expect(document.activeElement).toBe(radios[2]);
  });

  it('wraps around from the last option to the first on ArrowDown', async () => {
    radios[2].focus();
    radios[2].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }),
    );
    await group.updateComplete;
    expect(group.value).toBe('print');
    expect(document.activeElement).toBe(radios[0]);
  });

  it('moves to the previous option on ArrowUp', async () => {
    radios[1].focus();
    radios[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true }),
    );
    await group.updateComplete;
    expect(group.value).toBe('print');
    expect(document.activeElement).toBe(radios[0]);
  });
});

describe('news-radio-group form participation', () => {
  let form;
  let group;

  beforeEach(async () => {
    form = document.createElement('form');
    group = buildGroup();
    form.appendChild(group);
    document.body.appendChild(form);
    await group.updateComplete;
  });

  afterEach(() => {
    form.remove();
  });

  it('declares itself form-associated', () => {
    expect(group.constructor.formAssociated).toBe(true);
  });

  it('is associated with its enclosing form', () => {
    expect(group.form).toBe(form);
  });

  it('is invalid when required with no selection, valid once one is made', async () => {
    group.required = true;
    await group.updateComplete;
    expect(group.checkValidity()).toBe(false);

    group.value = 'print';
    await group.updateComplete;
    expect(group.checkValidity()).toBe(true);
  });

  it('restores its default (declared) value on form reset', async () => {
    group._defaultValue = 'print';
    group.value = 'both';
    await group.updateComplete;

    group.formResetCallback();
    await group.updateComplete;
    expect(group.value).toBe('print');
  });

  it('disabling the group takes every radio out of the tab order', async () => {
    group.value = 'print';
    await group.updateComplete;
    group.disabled = true;
    await group.updateComplete;
    const radios = [...group.querySelectorAll('news-radio')];
    expect(radios.every((r) => r.tabIndex === -1)).toBe(true);
  });
});

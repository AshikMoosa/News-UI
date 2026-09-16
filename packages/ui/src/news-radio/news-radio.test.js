import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-radio.js';

describe('news-radio', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-radio');
    el.value = 'print';
    el.textContent = 'Print edition';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('sets role="radio" on the host', () => {
    expect(el.getAttribute('role')).toBe('radio');
  });

  it('defaults to unchecked, aria-checked="false", tabindex -1', () => {
    expect(el.checked).toBe(false);
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.tabIndex).toBe(-1);
  });

  it('reflects checked to aria-checked and shows a dot', async () => {
    el.checked = true;
    await el.updateComplete;
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.shadowRoot.querySelector('.dot')).toBeTruthy();
  });

  it('reflects disabled to aria-disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('dispatches news-radio-select with its value on click', () => {
    const handler = vi.fn();
    el.addEventListener('news-radio-select', handler);
    el.shadowRoot.querySelector('.wrapper').click();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'print' });
  });

  it('dispatches news-radio-select on Space and Enter', () => {
    const handler = vi.fn();
    el.addEventListener('news-radio-select', handler);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('does not dispatch news-radio-select when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('news-radio-select', handler);
    el.shadowRoot.querySelector('.wrapper').click();
    expect(handler).not.toHaveBeenCalled();
  });
});

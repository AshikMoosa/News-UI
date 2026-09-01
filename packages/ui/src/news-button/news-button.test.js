import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import './news-button.js';

describe('news-button', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-button');
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a native button in its shadow root', () => {
    const button = el.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.type).toBe('button');
  });

  it('defaults to the primary variant', () => {
    expect(el.variant).toBe('primary');
    expect(el.getAttribute('variant')).toBe('primary');
  });

  it('exposes the button via the "button" shadow part', () => {
    const button = el.shadowRoot.querySelector('button');
    expect(button.getAttribute('part')).toBe('button');
  });

  it('dispatches news-click when activated', () => {
    const handler = vi.fn();
    el.addEventListener('news-click', handler);
    el.shadowRoot.querySelector('button').click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not dispatch news-click when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('news-click', handler);
    el.shadowRoot.querySelector('button').click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('reflects the disabled property to the native button', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('button').disabled).toBe(true);
  });
});

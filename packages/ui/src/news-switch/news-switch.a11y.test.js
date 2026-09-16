import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-switch.js';

describe('news-switch a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations off', async () => {
    const el = document.createElement('news-switch');
    el.textContent = 'Enable notifications';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations on', async () => {
    const el = document.createElement('news-switch');
    el.textContent = 'Enable notifications';
    el.checked = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations at size sm', async () => {
    const el = document.createElement('news-switch');
    el.textContent = 'Enable notifications';
    el.size = 'sm';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-switch');
    el.textContent = 'Enable notifications';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

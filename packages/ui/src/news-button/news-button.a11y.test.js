import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-button.js';

describe('news-button a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no detectable accessibility violations', async () => {
    const el = document.createElement('news-button');
    el.textContent = 'Submit';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-button');
    el.textContent = 'Submit';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

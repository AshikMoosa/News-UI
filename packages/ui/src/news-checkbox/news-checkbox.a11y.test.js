import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-checkbox.js';

describe('news-checkbox a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations unchecked', async () => {
    const el = document.createElement('news-checkbox');
    el.textContent = 'Accept terms';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations checked', async () => {
    const el = document.createElement('news-checkbox');
    el.textContent = 'Accept terms';
    el.checked = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations indeterminate', async () => {
    const el = document.createElement('news-checkbox');
    el.textContent = 'Select all';
    el.indeterminate = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-checkbox');
    el.textContent = 'Accept terms';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-input.js';

describe('news-input a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations with a label', async () => {
    const el = document.createElement('news-input');
    el.label = 'Email address';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations with a hint message', async () => {
    const el = document.createElement('news-input');
    el.label = 'Password';
    el.type = 'password';
    el.hint = 'At least 12 characters.';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations in the error state', async () => {
    const el = document.createElement('news-input');
    el.label = 'Email address';
    el.error = 'Enter a valid email address.';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-input');
    el.label = 'Email address';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

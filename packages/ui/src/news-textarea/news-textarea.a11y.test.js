import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-textarea.js';

describe('news-textarea a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations with a label', async () => {
    const el = document.createElement('news-textarea');
    el.label = 'Comments';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations with a hint message', async () => {
    const el = document.createElement('news-textarea');
    el.label = 'Comments';
    el.hint = 'Markdown is supported.';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations in the error state', async () => {
    const el = document.createElement('news-textarea');
    el.label = 'Comments';
    el.error = 'This field is required.';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-textarea');
    el.label = 'Comments';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

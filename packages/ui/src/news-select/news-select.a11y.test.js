import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-select.js';

const SECTIONS = [
  { value: 'world', label: 'World' },
  { value: 'finance', label: 'Finance' },
  { value: 'tech', label: 'Technology' },
];

describe('news-select a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations with a label', async () => {
    const el = document.createElement('news-select');
    el.label = 'Section';
    el.options = SECTIONS;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations with a placeholder', async () => {
    const el = document.createElement('news-select');
    el.label = 'Section';
    el.placeholder = 'Choose a section…';
    el.options = SECTIONS;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations in the error state', async () => {
    const el = document.createElement('news-select');
    el.label = 'Section';
    el.options = SECTIONS;
    el.error = 'Please choose a section.';
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-select');
    el.label = 'Section';
    el.options = SECTIONS;
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

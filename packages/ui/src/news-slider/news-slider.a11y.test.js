import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-slider.js';

describe('news-slider a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations with a label', async () => {
    const el = document.createElement('news-slider');
    el.label = 'Font size';
    el.value = 16;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });

  // Unlike news-input etc., news-slider's `label` really is optional in the
  // API (matching the reference), but an unlabeled range input has no
  // accessible name — that's not tested here as a "should pass" case for
  // the same reason no other form control in this library is tested
  // unlabeled: it's a real WCAG 4.1.2 violation, correctly caught by axe,
  // and it's on the consumer to always provide a label in practice.

  it('has no violations when disabled', async () => {
    const el = document.createElement('news-slider');
    el.label = 'Font size';
    el.disabled = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const results = await axe.run(el);
    expect(results.violations).toEqual([]);
  });
});

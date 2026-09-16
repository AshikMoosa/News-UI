import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
import './news-radio-group.js';
import '../news-radio/news-radio.js';

function buildGroup() {
  const group = document.createElement('news-radio-group');
  group.label = 'Delivery method';

  const print = document.createElement('news-radio');
  print.value = 'print';
  print.textContent = 'Print';
  const digital = document.createElement('news-radio');
  digital.value = 'digital';
  digital.textContent = 'Digital';

  group.append(print, digital);
  return group;
}

describe('news-radio-group a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has no violations with nothing selected', async () => {
    const group = buildGroup();
    document.body.appendChild(group);
    await group.updateComplete;

    const results = await axe.run(group);
    expect(results.violations).toEqual([]);
  });

  it('has no violations with an option selected', async () => {
    const group = buildGroup();
    group.value = 'print';
    document.body.appendChild(group);
    await group.updateComplete;

    const results = await axe.run(group);
    expect(results.violations).toEqual([]);
  });

  it('has no violations when disabled', async () => {
    const group = buildGroup();
    group.disabled = true;
    document.body.appendChild(group);
    await group.updateComplete;

    const results = await axe.run(group);
    expect(results.violations).toEqual([]);
  });
});

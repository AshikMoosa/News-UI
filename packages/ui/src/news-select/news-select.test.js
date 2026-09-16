import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-select.js';

const SECTIONS = [
  { value: 'world', label: 'World' },
  { value: 'finance', label: 'Finance' },
  { value: 'tech', label: 'Technology' },
];

describe('news-select', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-select');
    el.options = SECTIONS;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a native select with one <option> per entry in options', () => {
    const select = el.shadowRoot.querySelector('select');
    const options = [...select.querySelectorAll('option')];
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.value)).toEqual(['world', 'finance', 'tech']);
    expect(options.map((o) => o.textContent)).toEqual(['World', 'Finance', 'Technology']);
  });

  it('omits the label element when unset', () => {
    expect(el.shadowRoot.querySelector('label')).toBeNull();
  });

  it('renders the label, wired to the select via for/id', async () => {
    el.label = 'Section';
    await el.updateComplete;
    const label = el.shadowRoot.querySelector('label');
    expect(label.textContent.trim()).toBe('Section');
    expect(label.getAttribute('for')).toBe('select');
  });

  it('defaults to the first option when no value or placeholder is set', () => {
    const select = el.shadowRoot.querySelector('select');
    expect(select.value).toBe('world');
  });

  it('renders a disabled, hidden placeholder option when set', async () => {
    // options and placeholder set together, before first render — the
    // realistic usage pattern, and the one the component's value-sync
    // logic is designed around. (Adding a placeholder to an
    // already-rendered select whose value already defaulted to a real
    // option is a separate, genuinely ambiguous case: should that
    // retroactively blank out an existing selection? Not tested here.)
    const withPlaceholder = document.createElement('news-select');
    withPlaceholder.options = SECTIONS;
    withPlaceholder.placeholder = 'Choose a section…';
    document.body.appendChild(withPlaceholder);
    await withPlaceholder.updateComplete;

    const select = withPlaceholder.shadowRoot.querySelector('select');
    const placeholderOption = select.querySelector('option[value=""]');
    expect(placeholderOption).toBeTruthy();
    expect(placeholderOption.disabled).toBe(true);
    expect(placeholderOption.hidden).toBe(true);
    expect(select.value).toBe('');

    withPlaceholder.remove();
  });

  it('updates value and dispatches news-change when the selection changes', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    const select = el.shadowRoot.querySelector('select');
    select.value = 'finance';
    select.dispatchEvent(new Event('change'));
    expect(el.value).toBe('finance');
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'finance' });
  });

  it('shows the hint message when there is no error', async () => {
    el.hint = 'Pick the section you cover.';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('Pick the section you cover.');
    expect(message.classList.contains('hint')).toBe(true);
  });

  it('shows the error message instead of the hint when both are set', async () => {
    el.hint = 'Hint text';
    el.error = 'Please choose a section';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('Please choose a section');
    expect(message.classList.contains('error')).toBe(true);
  });

  it('reflects error state to aria-invalid on the native select', async () => {
    expect(el.shadowRoot.querySelector('select').getAttribute('aria-invalid')).toBe('false');
    el.error = 'Invalid';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('select').getAttribute('aria-invalid')).toBe('true');
  });

  it('disables individual options', async () => {
    el.options = [...SECTIONS, { value: 'opinion', label: 'Opinion', disabled: true }];
    await el.updateComplete;
    const select = el.shadowRoot.querySelector('select');
    expect(select.querySelector('option[value="opinion"]').disabled).toBe(true);
  });
});

describe('news-select form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-select');
    el.name = 'section';
    el.placeholder = 'Choose a section…';
    el.options = SECTIONS;
    form.appendChild(el);
    document.body.appendChild(form);
    await el.updateComplete;
  });

  afterEach(() => {
    form.remove();
  });

  it('declares itself form-associated', () => {
    expect(el.constructor.formAssociated).toBe(true);
  });

  it('is associated with its enclosing form', () => {
    expect(el.form).toBe(form);
  });

  it('is invalid when required with the placeholder selected, valid once a real option is chosen', async () => {
    el.required = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);

    el.value = 'tech';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('is invalid with a custom error even when a real option is selected', async () => {
    el.value = 'tech';
    el.error = 'This section is no longer accepting submissions.';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe('This section is no longer accepting submissions.');
  });

  it('restores its default (declared) value on formResetCallback', async () => {
    el._defaultValue = 'world';
    el.value = 'finance';
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe('world');
  });
});

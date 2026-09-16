import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './news-textarea.js';

describe('news-textarea', () => {
  let el;

  beforeEach(async () => {
    el = document.createElement('news-textarea');
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a native textarea, defaulting to 4 rows', () => {
    const textarea = el.shadowRoot.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea.rows).toBe(4);
  });

  it('omits the label element when unset', () => {
    expect(el.shadowRoot.querySelector('label')).toBeNull();
  });

  it('renders the label, wired to the textarea via for/id', async () => {
    el.label = 'Comments';
    await el.updateComplete;
    const label = el.shadowRoot.querySelector('label');
    expect(label.textContent.trim()).toBe('Comments');
    expect(label.getAttribute('for')).toBe('textarea');
  });

  it('respects a custom rows value', async () => {
    el.rows = 8;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('textarea').rows).toBe(8);
  });

  it('updates value and dispatches news-input on keystrokes', () => {
    const handler = vi.fn();
    el.addEventListener('news-input', handler);
    const textarea = el.shadowRoot.querySelector('textarea');
    textarea.value = 'hello\nworld';
    textarea.dispatchEvent(new Event('input'));
    expect(el.value).toBe('hello\nworld');
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail).toEqual({ value: 'hello\nworld' });
  });

  it('dispatches news-change on native change', () => {
    const handler = vi.fn();
    el.addEventListener('news-change', handler);
    el.shadowRoot.querySelector('textarea').dispatchEvent(new Event('change'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('shows the hint message when there is no error', async () => {
    el.hint = 'Markdown is supported.';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('Markdown is supported.');
    expect(message.classList.contains('hint')).toBe(true);
  });

  it('shows the error message instead of the hint when both are set', async () => {
    el.hint = 'Hint text';
    el.error = 'This field is required';
    await el.updateComplete;
    const message = el.shadowRoot.querySelector('.message');
    expect(message.textContent.trim()).toBe('This field is required');
    expect(message.classList.contains('error')).toBe(true);
  });

  it('reflects error state to aria-invalid on the native textarea', async () => {
    expect(el.shadowRoot.querySelector('textarea').getAttribute('aria-invalid')).toBe('false');
    el.error = 'Invalid';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('textarea').getAttribute('aria-invalid')).toBe('true');
  });
});

describe('news-textarea form participation', () => {
  let form;
  let el;

  beforeEach(async () => {
    form = document.createElement('form');
    el = document.createElement('news-textarea');
    el.name = 'comments';
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

  it('is invalid when required and empty, valid once filled in', async () => {
    el.required = true;
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);

    el.value = 'Some feedback.';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it('is invalid with a custom error even when the native textarea is otherwise valid', async () => {
    el.value = 'Some feedback.';
    el.error = 'Please keep it under 500 characters.';
    await el.updateComplete;
    expect(el.checkValidity()).toBe(false);
    expect(el.validationMessage).toBe('Please keep it under 500 characters.');
  });

  it('restores its default (declared) value on formResetCallback', async () => {
    el._defaultValue = 'Draft text';
    el.value = 'Edited text';
    await el.updateComplete;

    el.formResetCallback();
    await el.updateComplete;
    expect(el.value).toBe('Draft text');
  });
});

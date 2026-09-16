import { html } from 'lit';
import './news-textarea.js';

export default {
  title: 'Components/NewsTextarea',
  component: 'news-textarea',
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    label: 'Comments',
    placeholder: 'Tell us what you think…',
    disabled: false,
    required: false,
    rows: 4,
  },
};

export const Default = {
  render: ({ label, placeholder, disabled, required, rows }) => html`
    <news-textarea
      label=${label}
      placeholder=${placeholder}
      rows=${rows}
      ?disabled=${disabled}
      ?required=${required}
    ></news-textarea>
  `,
};

export const WithHint = {
  render: () => html`
    <news-textarea label="Article draft" hint="Markdown is supported." rows="6"></news-textarea>
  `,
};

export const WithError = {
  render: () => html`
    <news-textarea
      label="Comments"
      value="too short"
      error="Please write at least 50 characters."
    ></news-textarea>
  `,
};

export const Disabled = {
  render: () => html`
    <news-textarea label="Comments" value="This field is locked." disabled></news-textarea>
  `,
};

import { html } from 'lit';
import './news-input.js';

export default {
  title: 'Components/NewsInput',
  component: 'news-input',
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Email address',
    placeholder: 'reader@example.com',
    type: 'email',
    disabled: false,
    required: false,
  },
};

export const Default = {
  render: ({ label, placeholder, type, disabled, required }) => html`
    <news-input
      label=${label}
      placeholder=${placeholder}
      type=${type}
      ?disabled=${disabled}
      ?required=${required}
    ></news-input>
  `,
};

export const WithHint = {
  render: () => html`
    <news-input
      label="Password"
      type="password"
      hint="At least 12 characters, with a number and a symbol."
    ></news-input>
  `,
};

export const WithError = {
  render: () => html`
    <news-input
      label="Email address"
      value="not-an-email"
      error="Enter a valid email address."
    ></news-input>
  `,
};

export const WithAffixes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem;">
      <news-input label="Price" prefix="$" placeholder="0.00"></news-input>
      <news-input
        label="Website"
        prefix="https://"
        suffix=".com"
        placeholder="example"
      ></news-input>
    </div>
  `,
};

export const Disabled = {
  render: () => html`
    <news-input label="Email address" value="reader@example.com" disabled></news-input>
  `,
};

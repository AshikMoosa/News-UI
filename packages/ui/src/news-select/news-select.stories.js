import { html } from 'lit';
import './news-select.js';
import '../news-button/news-button.js';

const SECTIONS = [
  { value: 'world', label: 'World' },
  { value: 'finance', label: 'Finance' },
  { value: 'politics', label: 'Politics' },
  { value: 'technology', label: 'Technology' },
  { value: 'opinion', label: 'Opinion' },
];

export default {
  title: 'Components/NewsSelect',
  component: 'news-select',
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Section',
    disabled: false,
    required: false,
  },
};

export const Default = {
  render: ({ label, disabled, required }) => html`
    <news-select
      label=${label}
      .options=${SECTIONS}
      value="world"
      ?disabled=${disabled}
      ?required=${required}
    ></news-select>
  `,
};

export const WithPlaceholder = {
  render: () => html`
    <news-select label="Section" placeholder="Choose a section…" .options=${SECTIONS}></news-select>
  `,
};

export const WithHint = {
  render: () => html`
    <news-select
      label="Section"
      placeholder="Choose a section…"
      .options=${SECTIONS}
      hint="Pick the section you cover."
    ></news-select>
  `,
};

export const WithError = {
  render: () => html`
    <news-select
      label="Section"
      placeholder="Choose a section…"
      .options=${SECTIONS}
      error="Please choose a section."
    ></news-select>
  `,
};

export const WithDisabledOption = {
  render: () => html`
    <news-select
      label="Section"
      placeholder="Choose a section…"
      .options=${[...SECTIONS.slice(0, 3), { value: 'archive', label: 'Archive (unavailable)', disabled: true }]}
    ></news-select>
  `,
};

export const Disabled = {
  render: () => html`
    <news-select label="Section" .options=${SECTIONS} value="world" disabled></news-select>
  `,
};

export const InAForm = {
  render: () => html`
    <form
      style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; width: 16rem;"
      @submit=${(event) => event.preventDefault()}
    >
      <news-select
        name="section"
        label="Section"
        placeholder="Choose a section…"
        .options=${SECTIONS}
        required
      ></news-select>
      <news-button type="submit" size="sm">Continue</news-button>
    </form>
  `,
};

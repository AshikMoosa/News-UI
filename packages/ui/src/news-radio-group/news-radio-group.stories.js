import { html } from 'lit';
import './news-radio-group.js';
import '../news-radio/news-radio.js';
import '../news-button/news-button.js';

export default {
  title: 'Components/NewsRadioGroup',
  component: 'news-radio-group',
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    disabled: false,
    required: false,
  },
};

export const Default = {
  render: ({ disabled, required }) => html`
    <news-radio-group
      label="Delivery method"
      value="digital"
      ?disabled=${disabled}
      ?required=${required}
    >
      <news-radio value="print">Print edition</news-radio>
      <news-radio value="digital">Digital edition</news-radio>
      <news-radio value="both">Both</news-radio>
    </news-radio-group>
  `,
};

export const WithADisabledOption = {
  render: () => html`
    <news-radio-group label="Delivery method" value="digital">
      <news-radio value="print" disabled>Print edition (unavailable in your region)</news-radio>
      <news-radio value="digital">Digital edition</news-radio>
      <news-radio value="both">Both</news-radio>
    </news-radio-group>
  `,
};

export const NothingSelected = {
  render: () => html`
    <news-radio-group label="Delivery method">
      <news-radio value="print">Print edition</news-radio>
      <news-radio value="digital">Digital edition</news-radio>
      <news-radio value="both">Both</news-radio>
    </news-radio-group>
  `,
};

export const InAForm = {
  render: () => html`
    <form
      style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;"
      @submit=${(event) => event.preventDefault()}
    >
      <news-radio-group name="delivery" label="Delivery method" required>
        <news-radio value="print">Print edition</news-radio>
        <news-radio value="digital">Digital edition</news-radio>
        <news-radio value="both">Both</news-radio>
      </news-radio-group>
      <news-button type="submit" size="sm">Continue</news-button>
    </form>
  `,
};

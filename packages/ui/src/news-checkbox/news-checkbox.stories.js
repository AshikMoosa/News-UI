import { html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import './news-checkbox.js';
import '../news-button/news-button.js';

export default {
  title: 'Components/NewsCheckbox',
  component: 'news-checkbox',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    checked: false,
    disabled: false,
    required: false,
  },
};

export const Default = {
  render: ({ checked, disabled, required }) => html`
    <news-checkbox ?checked=${checked} ?disabled=${disabled} ?required=${required}
      >Send me the weekly digest</news-checkbox
    >
  `,
};

export const States = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <news-checkbox>Unchecked</news-checkbox>
      <news-checkbox checked>Checked</news-checkbox>
      <!-- indeterminate is a DOM property, not an attribute — set it via
           a ref once the element exists, same as the component itself does
           internally. -->
      <news-checkbox ${ref((el) => el && (el.indeterminate = true))}
        >Indeterminate (select all)</news-checkbox
      >
      <news-checkbox disabled>Disabled, unchecked</news-checkbox>
      <news-checkbox disabled checked>Disabled, checked</news-checkbox>
    </div>
  `,
};

export const InAForm = {
  render: () => html`
    <form
      style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;"
      @submit=${(event) => event.preventDefault()}
    >
      <news-checkbox name="terms" required>I agree to the terms of service</news-checkbox>
      <news-button type="submit" size="sm">Continue</news-button>
    </form>
  `,
};

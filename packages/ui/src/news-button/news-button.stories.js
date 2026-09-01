import { html } from 'lit';
import './news-button.js';

export default {
  title: 'Components/NewsButton',
  component: 'news-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    disabled: false,
  },
};

export const Default = {
  render: ({ variant, disabled }) => html`
    <news-button variant=${variant} ?disabled=${disabled}>Save changes</news-button>
  `,
};

export const AllVariants = {
  render: () => html`
    <div style="display: flex; gap: 12px;">
      <news-button variant="primary">Primary</news-button>
      <news-button variant="secondary">Secondary</news-button>
      <news-button variant="ghost">Ghost</news-button>
    </div>
  `,
};

export const Disabled = {
  render: () => html`<news-button disabled>Can't click me</news-button>`,
};

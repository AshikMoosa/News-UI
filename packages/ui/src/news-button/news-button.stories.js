import { html } from 'lit';
import './news-button.js';

export default {
  title: 'Components/NewsButton',
  component: 'news-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

export const Default = {
  render: ({ variant, size, disabled }) => html`
    <news-button variant=${variant} size=${size} ?disabled=${disabled}>Save changes</news-button>
  `,
};

export const AllVariants = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
      <news-button variant="primary">Publish</news-button>
      <news-button variant="secondary">Save Draft</news-button>
      <news-button variant="outline">Edit</news-button>
      <news-button variant="ghost">Cancel</news-button>
      <news-button variant="danger">Delete</news-button>
    </div>
  `,
};

export const AllSizes = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem;">
      <news-button size="xs">Extra Small</news-button>
      <news-button size="sm">Small</news-button>
      <news-button size="md">Medium</news-button>
      <news-button size="lg">Large</news-button>
    </div>
  `,
};

export const Disabled = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
      <news-button disabled>Disabled Primary</news-button>
      <news-button variant="outline" disabled>Disabled Outline</news-button>
    </div>
  `,
};

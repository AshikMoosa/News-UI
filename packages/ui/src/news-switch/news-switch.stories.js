import { html } from 'lit';
import './news-switch.js';
import '../news-button/news-button.js';

export default {
  title: 'Components/NewsSwitch',
  component: 'news-switch',
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    checked: false,
    disabled: false,
    size: 'md',
  },
};

export const Default = {
  render: ({ checked, disabled, size }) => html`
    <news-switch ?checked=${checked} ?disabled=${disabled} size=${size}
      >Enable notifications</news-switch
    >
  `,
};

export const Sizes = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <news-switch size="sm" checked>Small, on</news-switch>
      <news-switch size="md" checked>Medium, on</news-switch>
    </div>
  `,
};

export const States = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <news-switch>Off</news-switch>
      <news-switch checked>On</news-switch>
      <news-switch disabled>Disabled, off</news-switch>
      <news-switch disabled checked>Disabled, on</news-switch>
    </div>
  `,
};

export const InAForm = {
  render: () => html`
    <form
      style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;"
      @submit=${(event) => event.preventDefault()}
    >
      <news-switch name="notifications" checked>Email me about new articles</news-switch>
      <news-button type="submit" size="sm">Save preferences</news-button>
    </form>
  `,
};

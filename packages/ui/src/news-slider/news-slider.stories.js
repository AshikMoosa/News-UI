import { html } from 'lit';
import './news-slider.js';

export default {
  title: 'Components/NewsSlider',
  component: 'news-slider',
  argTypes: {
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  args: {
    label: 'Font size',
    value: 42,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
};

export const Default = {
  render: ({ label, value, min, max, step, disabled }) => html`
    <news-slider
      label=${label}
      value=${value}
      min=${min}
      max=${max}
      step=${step}
      ?disabled=${disabled}
    ></news-slider>
  `,
};

export const CustomRange = {
  render: () =>
    html`<news-slider label="Playback speed" value="4" min="1" max="10" step="1"></news-slider>`,
};

export const Disabled = {
  render: () => html`<news-slider label="Font size" value="16" disabled></news-slider>`,
};

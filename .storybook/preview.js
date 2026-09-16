import '../packages/tokens/dist/css/tokens.css';
import '../packages/tokens/dist/css/tokens.dark.css';

/** @type {import('@storybook/web-components-vite').Preview} */
const preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      test: 'error',
    },
    // Preview against the design system's real surface colors instead of
    // Storybook's default white canvas, so component contrast/borders read
    // the way they will in a consuming application.
    backgrounds: {
      default: 'newspaper',
      values: [
        { name: 'newspaper', value: '#f6f1e9' },
        { name: 'newspaper-dark', value: '#16100a' },
      ],
    },
  },
};

export default preview;

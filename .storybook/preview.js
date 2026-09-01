import '../packages/tokens/dist/css/tokens.css';
import '../packages/tokens/dist/css/tokens.dark.css';

/** @type {import('@storybook/web-components-vite').Preview} */
const preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@news-ui/ui',
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    setupFiles: ['./src/test-setup/element-internals-polyfill.js'],
  },
});

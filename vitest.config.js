import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});

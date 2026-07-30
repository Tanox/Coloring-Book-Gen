import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    pool: 'forks',
    poolOptions: { forks: { execArgv: ['--no-experimental-web-storage'] } },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/**/*.{ts,tsx}'],
    },
  },
});

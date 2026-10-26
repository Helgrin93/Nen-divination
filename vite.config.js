import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { watch: { ignored: ['**/.verification/**', '**/test-results/**', '**/playwright-report/**'] } },
  test: { include: ['src/tests/**/*.test.js'] },
});

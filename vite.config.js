import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/nen-divination/' : '/',
  server: { watch: { ignored: ['**/.verification/**', '**/test-results/**', '**/playwright-report/**'] } },
  test: { include: ['src/tests/**/*.test.js'] },
}));

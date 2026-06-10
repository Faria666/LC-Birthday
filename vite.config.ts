import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'src',
  base: '/LC-Birthday/',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['../tests/**/*.test.ts'],
  },
});

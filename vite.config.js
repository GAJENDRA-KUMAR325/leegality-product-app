/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      // text → console, html → browsable report, json-summary → badge/CI
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx', // app entry point — nothing to unit-test
        'src/**/*.test.{js,jsx}',
        'src/test/**',
      ],
      // Gate the build on coverage of the logic that matters.
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 50,
        lines: 70,
      },
    },
  },
})

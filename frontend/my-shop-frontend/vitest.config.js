import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    css: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: [...configDefaults.exclude, 'e2e/**', 'playwright.config.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
      thresholds: {
        lines: 30,
        functions: 30,
        statements: 30,
        branches: 20,
      },
    },
  },
})

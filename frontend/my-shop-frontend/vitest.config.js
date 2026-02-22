import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    css: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})

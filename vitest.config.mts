import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    pool: 'forks',
    maxConcurrency: 10,
    maxWorkers: process.env.CI ? 8 : 4,
    minWorkers: 1,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: false,
    include: [
      ...configDefaults.include,
      'src/**/*.test.{ts,tsx,js}',
      '**/__tests__/**/*.{test,spec}.{ts,tsx,js}'
    ],
    exclude: [...configDefaults.exclude, '**/index.ts', '**/types.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        ...configDefaults.include,
        'src/**/*.test.{ts,tsx,js}',
        '**/__tests__/**/*.{test,spec}.{ts,tsx,js}'
      ],
      exclude: [...configDefaults.exclude, '**/index.ts', '**/types.ts']
    }
  }
})

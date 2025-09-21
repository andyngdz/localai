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
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'scripts/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'scripts/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      ...configDefaults.exclude,
      '**/index.ts',
      '**/types.ts',
      '**/types/**'
    ],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'scripts/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        '**/index.ts',
        '**/types.ts',
        '**/types/**'
      ]
    }
  }
})

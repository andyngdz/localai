import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

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
    poolOptions: {
      threads: {
        singleThread: false
      }
    },
    include: ['src/**/*.test.{ts,tsx,js}', '**/__tests__/**/*.{test,spec}.{ts,tsx,js}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out/**',
      '**/electron/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      '**/**/index.ts',
      '.next/**'
    ],
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/dist/**',
        '**/out/**',
        '**/electron/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
        '**/index.ts',
        'next.config.ts',
        'postcss.config.mjs',
        'vitest.setup.ts',
        '.next/**'
      ]
    }
  }
})

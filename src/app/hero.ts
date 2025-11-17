import { heroui } from '@heroui/react'
export default heroui({
  defaultTheme: 'dark',
  themes: {
    dark: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          DEFAULT: '#2563eb',
          foreground: '#ffffff'
        },
        background: '#1a1a1a',
        foreground: '#e4e4e7'
      }
    }
  }
})

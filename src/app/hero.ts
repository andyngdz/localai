import { heroui } from '@heroui/react'
export default heroui({
  defaultTheme: 'dark',
  themes: {
    dark: {
      colors: {
        primary: {
          // Updated primary color palette from blue to indigo for a more modern, premium feel.
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#6366f1',
          foreground: '#ffffff'
        },
        background: '#1a1a1a',
        foreground: '#e4e4e7'
      }
    }
  }
})

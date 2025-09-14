import { heroui } from '@heroui/react'
export default heroui({
  defaultTheme: 'dark',
  themes: {
    dark: {
      colors: {
        // Primary - warm beige palette
        primary: {
          50: '#2d2a24',
          100: '#3d3529',
          200: '#4d4032',
          300: '#6d5a3e',
          400: '#856f4a',
          500: '#a08659',
          600: '#b89d6f',
          700: '#c9b085',
          800: '#d5c097',
          900: '#ddd1c0',
          DEFAULT: '#D5C097',
          foreground: '#1a1a1a'
        },
        // Secondary - cool blue complement
        secondary: {
          DEFAULT: '#4a7fb8',
          foreground: '#ffffff'
        },
        // Semantic colors
        success: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff'
        },
        danger: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        // Base colors
        background: '#20222C',
        foreground: '#F0F6FC',
        content1: '#1A1D23',
        content2: '#21262D',
        content3: '#2B313A',
        content4: '#363C45',
        // Utility colors
        overlay: 'rgba(0, 0, 0, 0.8)',
        focus: '#D5C097',
        divider: '#2E3139',
        default: {
          50: '#1A1D23',
          100: '#2A2D36',
          200: '#303543',
          300: '#3B4050',
          400: '#484F5E',
          500: '#5A6272',
          600: '#727A8B',
          700: '#9AA1AE',
          800: '#C4C8D0',
          900: '#E6E8EC',
          DEFAULT: '#2A2D36',
          foreground: '#EDEEF2'
        }
      }
    }
  }
})

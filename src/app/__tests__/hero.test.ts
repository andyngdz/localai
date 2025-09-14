import { beforeEach, describe, expect, it, vi } from 'vitest'

const defaultThemeConfig = {
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
}

// Mock the heroui function
const mockHeroui = vi.fn()
vi.mock('@heroui/react', () => ({
  heroui: mockHeroui
}))

describe('hero.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })
  it('exports heroui function result as default', async () => {
    const mockResult = { theme: 'hero-ui-config' }
    mockHeroui.mockReturnValue(mockResult)

    // Dynamic import to test the default export
    const heroModule = await import('../hero')

    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig)
    expect(heroModule.default).toBe(mockResult)
  })

  it('calls heroui with correct configuration', async () => {
    mockHeroui.mockReturnValue({})

    await import('../hero')

    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig)
    expect(mockHeroui).toHaveBeenCalledTimes(1)
  })

  it('returns the exact result from heroui function', async () => {
    const expectedConfig = {
      theme: {
        colors: { primary: '#000' },
        spacing: { sm: '8px' }
      }
    }

    mockHeroui.mockReturnValue(expectedConfig)

    const heroModule = await import('../hero')

    // Verify that heroui was called with correct arguments
    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig)

    // Verify the returned value
    expect(heroModule.default).toEqual(expectedConfig)
    expect(heroModule.default).toBe(expectedConfig)
  })
})

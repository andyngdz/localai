import { beforeEach, describe, expect, it, vi } from 'vitest'

const defaultThemeConfig = {
  defaultTheme: 'dark',
  themes: {
    dark: {
      colors: {
        primary: {
          // Updated to indigo palette (primary brand color revision)
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

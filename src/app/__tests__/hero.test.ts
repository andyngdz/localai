import { beforeEach, describe, expect, it, vi } from 'vitest'

const defaultThemeConfig = {
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

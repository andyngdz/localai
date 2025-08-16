import { describe, expect, it, vi, beforeEach } from 'vitest';

const defaultThemeConfig = {
  defaultTheme: 'dark',
  themes: {
    dark: {
      colors: {
        default: {
          100: '#2A2D36',
        },
        primary: '#D5C097',
        background: '#20222C',
        divider: '#2E3139',
      },
    },
  },
};

// Mock the heroui function
const mockHeroui = vi.fn();
vi.mock('@heroui/react', () => ({
  heroui: mockHeroui,
}));

describe('hero.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  it('exports heroui function result as default', async () => {
    const mockResult = { theme: 'hero-ui-config' };
    mockHeroui.mockReturnValue(mockResult);

    // Dynamic import to test the default export
    const heroModule = await import('../hero');

    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig);
    expect(heroModule.default).toBe(mockResult);
  });

  it('calls heroui with correct configuration', async () => {
    mockHeroui.mockReturnValue({});

    await import('../hero');

    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig);
    expect(mockHeroui).toHaveBeenCalledTimes(1);
  });

  it('returns the exact result from heroui function', async () => {
    const expectedConfig = {
      theme: {
        colors: { primary: '#000' },
        spacing: { sm: '8px' },
      },
    };

    mockHeroui.mockReturnValue(expectedConfig);

    const heroModule = await import('../hero');

    // Verify that heroui was called with correct arguments
    expect(mockHeroui).toHaveBeenCalledWith(defaultThemeConfig);

    // Verify the returned value
    expect(heroModule.default).toEqual(expectedConfig);
    expect(heroModule.default).toBe(expectedConfig);
  });
});

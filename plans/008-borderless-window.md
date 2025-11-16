# Plan 008: Borderless Window with Custom Controls

## Overview

Transform the Electron window into a modern borderless design with 16px rounded corners, custom window controls in the top-right, and a draggable title bar showing the current page/section.

## Design Decisions

- **Platform behavior**: Same custom controls on all platforms (Windows, macOS, Linux)
- **Control position**: Top-right corner (Windows/Linux convention)
- **Title bar content**: Current page/section indicator + window control buttons
- **Border radius**: 16px (large, modern macOS-like appearance)

## Implementation Steps

### 1. Electron Main Process (`electron/main.ts`)

- Add `frame: false` and `roundedCorners: true` to `BrowserWindow` options
- Implement IPC handlers for: `window:minimize`, `window:maximize`, `window:unmaximize`, `window:close`, `window:isMaximized`
- Add window state event listeners to notify renderer when maximized state changes

### 2. IPC Bridge (`electron/preload.ts` + `types/electron.ts`)

- Expose window control methods in `ElectronAPI` interface
- Add `window.minimize()`, `window.toggleMaximize()`, `window.close()`, `window.onMaximizedChange(callback)`
- Update TypeScript types

### 3. Window Controls Feature (new directory)

Create `src/features/window-controls/`:

- **`presentations/WindowTitleBar.tsx`**: Main title bar component with drag region, current section display, and control buttons
- **`presentations/WindowControlButtons.tsx`**: Minimize/Maximize/Close buttons (top-right) using HeroUI Button + Lucide icons
- **`states/useWindowState.ts`**: Zustand store to track maximized state via IPC events
- **`constants/index.ts`**: CSS classes for drag regions, button styles

### 4. App Layout Integration (`src/app/app-layout.tsx`)

- Add `<WindowTitleBar />` as first child in flex column layout
- Pass current route/section name as prop (extract from Next.js router)
- Adjust main content area to account for title bar height

### 5. Styling

- Apply `-webkit-app-region: drag` to title bar background
- Apply `-webkit-app-region: no-drag` to interactive buttons
- Use `rounded-2xl` (16px) for window border radius via Tailwind
- Add CSS for transparent title bar background with backdrop blur
- Handle maximized state: remove border radius when window is maximized

### 6. Current Section Detection

- Use Next.js `usePathname()` hook to detect current route
- Map routes to section names (e.g., `/generator` → "Generator", `/settings` → "Settings")
- Display in title bar with subtle styling

## Files to Create

- `src/features/window-controls/presentations/WindowTitleBar.tsx`
- `src/features/window-controls/presentations/WindowControlButtons.tsx`
- `src/features/window-controls/states/useWindowState.ts`
- `src/features/window-controls/constants/index.ts`
- `src/features/window-controls/__tests__/WindowTitleBar.test.tsx`
- `src/features/window-controls/__tests__/WindowControlButtons.test.tsx`

## Files to Modify

- `electron/main.ts` - Add frame: false, IPC handlers, window event listeners
- `electron/preload.ts` - Expose window control methods
- `types/electron.ts` - Add window control types
- `src/app/app-layout.tsx` - Integrate WindowTitleBar component
- `src/app/globals.css` - Add webkit-app-region styles if needed

## Testing Strategy

- Unit tests for window control components (button clicks trigger correct IPC calls)
- Test maximized state reactivity (store updates when window state changes)
- Manual testing on Linux (primary platform based on git branch)
- Verify drag region works and buttons remain interactive

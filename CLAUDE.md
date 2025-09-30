# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Common Tasks

- **Start development server**: `npm run dev` (Next.js with Turbopack)
- **Start desktop development**: `npm run desktop` (runs Next.js + Electron concurrently)
- **Build for production**: `npm run build` (compiles Electron + builds Next.js + packages with electron-builder)
- **Compile Electron only**: `npm run compile`

### Testing & Quality

- **Run all tests**: `npm test` (Vitest)
- **Run single test**: `npm test -- path/to/test.tsx`
- **Run tests with coverage**: `npm run test:coverage`
- **Type checking**: `npm run type-check`
- **Lint code**: `npm run lint` (ESLint)
- **Format code**: `npm run format` (Prettier)
- **CI lint**: `npm run ci:lint` (with JSON output)
- **CI format check**: `npm run ci:format`

### Pre-Commit Hooks

The project uses Husky with lint-staged. Changes are automatically linted and formatted before commit.

## Architecture Overview

This is a Next.js/React frontend with Electron integration and a separate Python FastAPI backend. The project uses a feature-first architecture.

### Core Structure

- **Frontend**: Next.js 15 with App Router in TypeScript
- **Desktop**: Electron wrapper for native desktop app
- **Backend**: Separate Python FastAPI service (localai_backend/)
- **State Management**: Zustand stores
- **Styling**: Tailwind CSS 4 + HeroUI components
- **Testing**: Vitest + React Testing Library
- **Real-time**: Socket.io for WebSocket communication

### Key Directories

```
src/
├── app/              # Next.js app router pages
├── cores/            # Core utilities and constants
├── features/         # Feature modules (feature-first architecture)
│   └── feature-name/
│       ├── presentations/  # UI components + tests
│       └── states/         # Zustand stores + hooks + tests
├── services/         # API integration (axios + React Query)
└── sockets/          # Socket.io configuration

electron/             # Electron main process, preload, IPC handlers
scripts/              # Build and development scripts (TypeScript)
types/                # Shared TypeScript type definitions
```

### Type System

- **Path Aliases**: Use `@/*` for `src/*` and `@types` for `types/`
- **Shared Types**: All shared types live in `types/` directory
  - `types/index.ts` exports all types (use `import type { Foo } from '@types'`)
  - `types/electron.ts` defines Electron API and Window interface extensions
  - `types/logging.ts`, `types/backend.ts`, `types/base.ts` for domain types
- **Type Imports**: Always use `import type` for type-only imports

### Development Patterns

- **Features**: Self-contained modules in `src/features/` with presentations (UI) and states (logic)
- **Components**: Use HeroUI + Tailwind, keep small and focused
- **State**: Zustand stores following the reset pattern with `getInitialState()`
  - Simple stores: Use `create<Store>((set) => ({ ... }))`
  - Persistent stores: Use `persist()` middleware with localStorage
  - Mutable updates: Use `immer()` middleware for complex state updates
- **API**: Centralized in `src/services/api.ts` with React Query hooks
- **Socket Events**: Real-time communication using shared socket instance and constants
  - Socket instance: `src/sockets/socket.ts` (singleton, connects to `http://localhost:8000`)
  - Event constants: `src/sockets/events.ts` (use `SocketEvents` class)
  - Listen to events in components/hooks, emit from backend

### Electron Architecture

- **Main Process** (`electron/main.ts`): Window creation, IPC handlers, backend lifecycle
- **Preload** (`electron/preload.ts`): Exposes `window.electronAPI` with type-safe IPC methods
- **IPC Communication**:
  - Frontend calls `window.electronAPI.backend.method()`
  - Main process handles via `ipcMain.handle()`
  - Log streaming uses event emitters for real-time updates
- **Security**: Sandbox enabled, context isolation, no node integration in renderer
- **Development**: Use `npm run desktop` to run Next.js + Electron concurrently

### Scripts Architecture

The `scripts/` directory contains TypeScript utilities for development and build processes:

- **Backend management**: Python environment setup, LocalAI backend cloning/starting
- **Electron compilation**: TypeScript to CommonJS compilation for Electron main/preload
- **Development orchestration**: Concurrent Next.js and Electron processes
- Run scripts with `tsx scripts/scriptname.ts`

## Testing Guidelines

- **Framework**: Vitest + React Testing Library
- **Location**: Tests in `__tests__/` folders mirroring source structure
  - Example: `src/features/backend-logs/states/__tests__/useBackendLog.test.ts`
- **Patterns**: AAA pattern (Arrange-Act-Assert), descriptive test names
- **Mocking**:
  - Use `vi.mock()` for module mocks
  - Mock Zustand stores by mocking the entire module
  - Mock Electron API by setting `global.window.electronAPI` with proper types
  - Clean up mocks with `afterEach(() => { vi.clearAllMocks() })`
- **Coverage**: Target ≥80% for functions, lines, and branches
- **Test Structure**: Group related tests with `describe()` blocks
- **Async Testing**: Use `waitFor()` from `@testing-library/react` for async assertions
- **Hook Testing**: Use `renderHook()` and `act()` from `@testing-library/react`

### Testing Zustand Stores

```typescript
import { renderHook, act } from '@testing-library/react'
import { useMyStore } from '../useMyStore'

describe('useMyStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useMyStore())
    act(() => {
      result.current.reset()
    })
  })

  it('should update state', () => {
    const { result } = renderHook(() => useMyStore())

    act(() => {
      result.current.setState({ value: 'new' })
    })

    expect(result.current.value).toBe('new')
  })
})
```

### Testing Hooks with Electron API

```typescript
import type { ElectronAPI } from '@types'

beforeEach(() => {
  global.window.electronAPI = {
    downloadImage: vi.fn(),
    onBackendSetupStatus: vi.fn(),
    backend: {
      startLogStream: vi.fn().mockResolvedValue(undefined)
      // ... other methods
    }
  } as ElectronAPI
})

afterEach(() => {
  delete (global.window as { electronAPI?: ElectronAPI }).electronAPI
})
```

## Pre-Commit Checklist

Before committing changes:

1. Run affected tests: `npm test -- path/to/changed/files`
2. Run linter: `npm run lint`
3. Run type checker: `npm run type-check`
4. Format code: `npm run format`

Note: Pre-commit hooks will automatically run lint-staged to lint and format staged files.

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

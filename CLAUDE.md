# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LocalAI is a Next.js-based Electron application for running AI models locally. It provides a web interface for image generation with Stable Diffusion, model management, and AI inference capabilities. The workspace contains two main projects:

- `localai/` - Next.js/React frontend for the user interface
- `localai_backend/` - Python FastAPI backend service
- `electron/` - Electron layer for desktop application integration

The frontend communicates with the backend server running on port 8000.

## Development Commands

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run dev:desktop` - Start the Electron desktop version using `./scripts/run-desktop.sh`
- `npm run build` - Build the application and create Electron distribution
- `npm run start` - Start production Next.js server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests with Vitest
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run ci:lint` - Run linting for CI (outputs JSON report)
- `npm run ci:format` - Check formatting for CI

## Architecture

### Feature-Based Structure

The codebase follows a feature-first architecture where each feature is self-contained in `src/features/`. New functionality should be encapsulated within a new or existing directory in `src/features/`.

- **generators** - Core image generation functionality with Stable Diffusion
- **histories** - History management for generated content
- **model-search** - Model discovery and download capabilities
- **model-recommendations** - AI model recommendations based on hardware
- **gpu-detection** - Hardware detection and GPU compatibility
- **max-memory-scale-factor** - Memory management for models
- **generator-configs** - Configuration management for generation parameters
- **streaming-messages** - Real-time messaging and notifications

### Project Structure (`src/`)

```
src/
├── app/            # Next.js app router components
├── cores/          # Core utilities and constants
├── features/       # Feature modules (feature-first architecture)
│   └── feature-name/
│       ├── presentations/ # UI components
│       │   └── __tests__/  # Component tests
│       └── states/        # State management (Zustand stores, hooks)
│           └── __tests__/  # State tests
├── services/       # API and data services
├── sockets/        # Socket.io configuration
└── types/          # TypeScript type definitions
```

Each feature typically contains:

- `presentations/` - React components and UI
- `states/` - State management hooks (Zustand stores)
- `types/` - TypeScript type definitions
- `constants/` - Feature-specific constants
- `services/` - Business logic and API calls
- `__tests__/` - Vitest test files

### Key Architectural Patterns

**State Management**: Uses Zustand for global state, React Query for server state, and React Hook Form for form state management.

**API Communication**: Axios-based client (`src/services/api.ts`) communicates with backend at `http://localhost:8000`. Real-time features use Socket.io for WebSocket connections. Query hooks are defined in `src/services/queries.ts`.

**Styling**: TailwindCSS with `clsx` for conditional classes. Use `@heroui/react` for UI primitives. Custom CSS modules for specific features like timeline styles.

**Testing**: Vitest with React Testing Library, comprehensive test coverage including snapshots for UI components. Follow AAA pattern (Arrange → Act → Assert) and use descriptive test names.

## Development Patterns & Guidelines

### Coding Standards
- **Feature-First**: New functionality should be encapsulated within a new or existing directory in `src/features/`
- **Reusability**: If code is used in more than two places, extract it into a reusable utility/hook/component
- **Component Design**: Keep components small, focused, and prefer composition. Avoid deep nesting
- **Type Safety**: Use TypeScript consistently. Avoid `any` where possible
- Use English for all code and documentation
- Always declare types for variables and functions
- Use JSDoc to document public classes and methods

### State Management (Zustand)
Follow the existing store creation pattern:
```typescript
export const useMessageStore = create<MessageStoreProps>((set, _get, store) => ({
  message: '',
  setMessage: (message) => set({ message }),
  reset: () => set(store.getInitialState()),
}));
```

### Socket Integration
Use the shared socket instance from `@/sockets` and event constants from `SocketEvents`:
```typescript
useEffect(() => {
  socket.on(SocketEvents.DOWNLOAD_START, () => {
    setMessage('Downloading model');
  });
  return () => {
    socket.off(SocketEvents.DOWNLOAD_START);
  };
}, []);
```

## Testing Guidelines

- **Frameworks**: Use **Vitest** and **@testing-library/react**
- **Location**: Test files mirror the source structure in `__tests__` folders
- **Pattern**: Follow AAA pattern (Arrange → Act → Assert)
- **Naming**: Use descriptive test names (e.g., `"shows error message when API fails"`)
- **Mocks**: Use `vi.mock` for modules and clean up with `afterEach`
- **Coverage**: Target ≥ 80% coverage for functions, lines, and branches

### Running Tests
- `npm run test` - Run all tests
- `npm test -- <path/to/test.tsx>` - Run single test file  
- `npm run test:coverage` - Run tests with coverage reporting
- Test files are located in `__tests__/` directories within each feature

## Backend Integration

The application expects a LocalAI backend server running on `http://localhost:8000` providing REST API endpoints for:

- Health checks (`/`)
- Model management and downloads
- Hardware detection
- Image generation
- Memory management
- Model recommendations

WebSocket connection for real-time updates during model operations.

## Pre-PR Checklist

Before submitting pull requests, ensure:

1. **Run affected unit tests** (`npm test -- <file>`)
2. **Run linter** (`npm run lint`) if TS/JS files changed
3. **Run formatter** (`npm run format`)
4. If backend contracts in `localai_backend/` were changed, ensure corresponding frontend types in `src/types` are updated

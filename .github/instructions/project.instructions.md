---
applyTo: '**'
---

# LocalAI Coding Guidelines for AI Agents

This document provides essential knowledge for working effectively with the LocalAI codebase. It is based on the project's `rules.md` and tailored for AI agent use.

## Architecture Overview

The workspace contains two main projects:

- `localai/`: A Next.js/React frontend for the user interface.
- `localai_backend/`: A Python FastAPI backend service.
- `src-tauri/`: A Tauri layer for desktop application integration.

This guide focuses primarily on the `localai/` frontend.

### Key Frontend Components

- **Features**: Self-contained modules under `src/features/`. Each contains its own `presentations/` (UI) and `states/` (logic).
  - Examples: `streaming-messages`, `gpu-detection`, `model-recommendations`

- **Services**: API integration and data fetching under `src/services/`.
  - `api.ts`: Axios-based client for backend communication.
  - `queries.ts`: React Query hooks for data fetching.

- **Sockets**: Real-time communication under `src/sockets/`.
  - `socket.ts`: Socket.io client configuration.
  - `events.ts`: Socket event constants.

## Project Structure (`localai/src/`)

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

## Development Patterns & Conventions

### Coding Standards

- **Feature-First**: New functionality should be encapsulated within a new or existing directory in `src/features/`.
- **Reusability**: If a piece of code is used in more than two places, extract it into a reusable utility/hook/component.
- **Component Design**: Keep components small, focused, and prefer composition. Avoid deep nesting.
- **Styling**: Use Tailwind CSS with `clsx` for conditional classes. Use `@heroui/react` for UI primitives.
- **Type Safety**: Use TypeScript consistently. Avoid `any` where possible.

### State Management (Zustand)

- **Pattern**: Follow the existing store creation pattern.
- **Example** from `src/features/streaming-messages/states/useMessageStores.ts`:
  ```typescript
  export const useMessageStore = create<MessageStoreProps>((set, _get, store) => ({
    message: '',
    setMessage: (message) => set({ message }),
    reset: () => set(store.getInitialState()),
  }));
  ```

### Data Fetching (React Query)

- Centralize API calls in `src/services/api.ts`.
- Define query hooks in `src/services/queries.ts`.

### Socket Integration

- Use the shared socket instance from `@/sockets` and event constants from `SocketEvents`.
- **Hook Pattern**: Subscribe and unsubscribe in `useEffect`.
- **Example** from `useStreamingMessage.ts`:

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

- **Frameworks**: Use **Vitest** and **@testing-library/react**.
- **Location**: Test files mirror the source structure in `__tests__` folders.
- **Mocks**: Use `vi.mock` for modules and clean up with `afterEach`.
- **Readability**: Break long mock chains into multiple lines for clarity.
- **Example Mock**:

  ```typescript
  vi.mocked(useModelRecommendationsQuery).mockReturnValue({
    data: { default_selected_id: 'test-id' },
  } as ReturnType<typeof useModelRecommendationsQuery>);

  renderHook(() => useModelRecommendation());

  expect(setValue).toHaveBeenCalledWith('id', 'test-id');
  ```

- **Example Test Structure**:

  ```typescript
  describe('ComponentName', () => {
    beforeEach(() => {
      // Setup mocks
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should do something', () => {
      // Test implementation
    });
  });
  ```

## Developer Workflow & Commands

- **Run dev server**: `npm run dev`
- **Build project**: `npm run build`
- **Run all tests**: `npm test`
- **Run single test file**: `npm test -- <path/to/test.tsx>`
- **Run coverage**: `npm run test:coverage`
- **Lint & Format**: `npm run lint` and `npm run format`

## Agent Pre-PR Checklist

1.  **Run affected unit tests** (`npm test -- <file>`).
2.  **Run linter** (`npm run lint`) if TS/JS files changed.
3.  **Run formatter** (`npm run format`).
4.  If backend contracts in `localai_backend/` were changed, ensure corresponding frontend types in `localai/src/types` are updated.

## Where to Look First

- **UI & State**: `src/features/*/presentations/*` and `src/features/*/states/*`
- **Backend API Surface**: `src/services/api.ts` and `src/services/queries.ts`
- **Real-time Logic**: `src/sockets/*`
- **Backend Routes**: `localai_backend/main.py`

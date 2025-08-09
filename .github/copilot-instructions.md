# LocalAI Coding Guidelines

This document provides essential knowledge for working effectively with the LocalAI codebase.

## Architecture Overview

LocalAI is a React application built with Next.js, focusing on providing a frontend interface for AI model management and execution. The project follows a feature-first architecture with clear separation of concerns.

### Key Components

- **Features**: Self-contained modules with their own presentations and states
  - Each feature has its own directory in `src/features/`
  - Examples: `streaming-messages`, `gpu-detection`, `model-recommendations`

- **Services**: API integration and data formatting
  - `api.ts`: Axios-based client for backend communication
  - `formatter.ts`: Data transformation utilities
  - `queries.ts`: React Query definitions

- **Sockets**: Real-time communication with backend
  - `socket.ts`: Socket.io configuration
  - `events.ts`: Socket event constants

## Project Structure

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

## Development Patterns

### State Management

- **Zustand** is used for state management
- Store definition pattern:
```typescript
// Example from src/features/streaming-messages/states/useMessageStores.ts
export const useMessageStore = create<MessageStoreProps>(
  (set, _get, store) => ({
    message: "",
    setMessage: (message) => set({ message }),
    reset: () => set(store.getInitialState()),
  })
);
```

### Component Structure

- React 19 functional components with hooks
- Tailwind CSS for styling with `clsx` for conditional classes
```typescript
// Example from src/features/streaming-messages/presentations/StreamingMessage.tsx
<div
  className={clsx(
    "fixed inset-0 z-10",
    "backdrop-blur-md bg-background/90"
  )}
>
```

### Socket Integration

- Socket.io for real-time updates
- Use the socket instance from `@/sockets` and event constants from `SocketEvents`
- Hook pattern for socket subscriptions:
```typescript
// Example from useStreamingMessage.ts
useEffect(() => {
  socket.on(SocketEvents.DOWNLOAD_START, () => {
    setMessage("Downloading model");
  });
  
  return () => {
    socket.off(SocketEvents.DOWNLOAD_START);
  };
}, []);
```

## Testing Guidelines

- **Vitest** is used as the testing framework
- **@testing-library/react** for component testing
- Test file structure mirrors source file structure in `__tests__` folders
- Mock patterns:
  1. Direct module mocking with `vi.mock`
  2. Spy on module functions with `vi.spyOn`
  3. Clean up between tests with `afterEach`

```typescript
// Example test structure
describe("ComponentName", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should do something", () => {
    // Test implementation
  });
});
```

## Developer Workflow

- Run development server: `npm run dev`
- Run tests: `npm test` or `npm run test:coverage`
- Socket server expected at `http://localhost:8000`

## Key Integrations

- **Backend API**: RESTful API at `http://localhost:8000`
- **Socket.io**: Real-time events for model loading and processing
- **React Query**: Data fetching and caching with Tanstack Query

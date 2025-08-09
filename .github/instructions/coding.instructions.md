---
applyTo: "**"
---

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

### Coding standards

- Reusable code is a must, if a part of code needs to be used more than 2 places, make it reusable
- Frontend using feature-first layer
- Consistent use of TypeScript for type safety
- Follow accessibility best practices (e.g., ARIA roles, keyboard navigation)
- Write unit tests for all new features and bug fixes
- Keep components small and focused
- Use descriptive names for variables and functions
- Avoid deeply nested components and hooks
- Prefer composition over inheritance
- Modular architecture with clear boundaries
- Should use predefined types from TypeScript

```typescript
   // Example using the predefined types from TypeScript
   () => void: VoidFunction;
```

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
- Use correct types, avoid using `any`, if possible
- Avoid using `unknown` if you can find the types, if possible
- Test should cover necessary cases, not over-testing
- Break to newline to make the tests easy to read
- Test file structure mirrors source file structure in `__tests__` folders
- Mock patterns:
  1. Direct module mocking with `vi.mock`
  2. Spy on module functions with `vi.spyOn`
  3. Clean up between tests with `afterEach`
- After each test, you should run and check if the tests work

```typescript
// Example break to newline
vi.mocked(useModelRecommendationsQuery).mockReturnValue({
  data: { default_selected_id: "test-id" },
} as ReturnType<typeof useModelRecommendationsQuery>);

renderHook(() => useModelRecommendation());

expect(setValue).toHaveBeenCalledWith("id", "test-id");
```

```typescript
// Example break to newline
vi.mocked(useModelRecommendationsQuery).mockReturnValue({
  data: {},
} as ReturnType<typeof useModelRecommendationsQuery>);
vi.mocked(api.downloadModel).mockResolvedValue({});

const { result } = renderHook(() => useModelRecommendation());

await act(async () => {
  await result.current.onSubmit({ id: "model-123" });
});

expect(api.downloadModel).toHaveBeenCalledWith("model-123");
```

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

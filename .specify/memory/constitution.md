<!--
Sync Impact Report
==================
Version change: N/A (initial) → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (5 principles)
  - Performance Standards
  - Quality Gates
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (Success Criteria section exists)
  - .specify/templates/tasks-template.md: ✅ Compatible (Test-first pattern supported)
Follow-up TODOs: None
-->

# LocalAI Constitution

## Core Principles

### I. Type Safety First

All code MUST use strict TypeScript with no `any` types. The `@typescript-eslint/no-explicit-any` rule is enforced as an error.

- Use `unknown` with proper type guards when type is uncertain
- Use type assertions (`as Type`) only when type is provably correct
- Prefer built-in utility types (e.g., `VoidFunction`, `Record<K, V>`)
- Path aliases MUST be used: `@/*` for src, `@types` for shared types

**Rationale**: Type safety catches errors at compile time, improves IDE support, and serves as living documentation.

### II. Test-First Development

Tests MUST be written before implementation for new features and bug fixes. Tests MUST verify behavior, not implementation.

- Tests live in `__tests__/` folders adjacent to source files
- Use Vitest + React Testing Library
- Mock external dependencies (APIs, Electron IPC, Socket.io, Zustand stores)
- Reset Zustand stores in `beforeEach` to prevent test pollution
- Aim for 100% coverage on critical paths: state management, data flow, business logic

**Rationale**: Test-first ensures requirements are understood before coding and produces testable, modular designs.

### III. User Experience Consistency

UI components MUST follow established patterns for predictable, polished user experience.

- Component names MUST include feature prefix (e.g., `GeneratorImageRenderer`, `HistoryDeleteButton`)
- `'use client'` directive required for components using React hooks, Zustand, or browser APIs
- Hooks at component top: custom hooks → UI library hooks → React hooks
- Use `useMemo` for conditional rendering or expensive JSX computations
- Loading states via Skeleton components, not spinners, for reduced layout shift
- Error states MUST be user-actionable with clear recovery paths

**Rationale**: Consistent patterns reduce cognitive load for users and developers, making the app intuitive and the codebase navigable.

### IV. Reactive State Architecture

State management MUST use the established reactive patterns for predictability and debuggability.

- Zustand stores for shared state with `reset()` pattern
- `useState` for component-local state only
- React Query for server state (API data fetching)
- Socket.io via `useSocketEvent()` hook only—NEVER use `socket.on()` directly
- Electron IPC via `window.electronAPI.backend.method()` only
- Use `partialize` to exclude UI state from persistence
- Prefer `useLocalStorage` over `useRef` for persistent component state

**Rationale**: Consistent state patterns prevent race conditions, simplify debugging, and enable predictable data flow.

### V. Simplicity Over Abstraction

Code MUST be simple, direct, and solve only the current problem. YAGNI principle is mandatory.

- Prefer simple variables over nested property access
- Use direct function refs vs arrow wrappers when no args needed
- Extract conditionals to named variables before JSX
- Use `es-toolkit/compat` utilities (e.g., `isEmpty()` vs length checks)
- NO speculative features, premature abstractions, or "just in case" code
- Comments describe WHAT code does (not why/how), omit when self-documenting

**Rationale**: Simple code is readable, maintainable, and has fewer bugs. Complexity must be earned by real requirements.

## Performance Standards

Performance MUST meet these thresholds for acceptable user experience:

| Metric                  | Target      | Measurement                          |
| ----------------------- | ----------- | ------------------------------------ |
| Initial app load        | < 3 seconds | Time from launch to interactive UI   |
| Page transitions        | < 200ms     | Time for route changes               |
| Image generation start  | < 1 second  | Time from submit to visible progress |
| UI interaction response | < 100ms     | Button clicks, input changes         |
| Memory baseline         | < 500MB     | Frontend process at idle             |
| Socket reconnection     | < 5 seconds | Auto-reconnect after disconnect      |

**Validation**: Performance must be tested on minimum spec hardware (8GB RAM, integrated GPU) before release.

## Quality Gates

All code changes MUST pass these gates before merge:

### Pre-Commit Gates (Automated)

1. `pnpm run type-check` — Zero TypeScript errors
2. `pnpm run lint` — Zero ESLint errors
3. `pnpm run format` — Code formatted with Prettier
4. `pnpm test` — All tests pass

### Pre-Merge Gates (Review Required)

1. **Behavior tested** — New functionality has corresponding tests
2. **No `any` types** — TypeScript strict mode compliance verified
3. **UX patterns followed** — Component naming, loading states, error handling
4. **Performance validated** — No regressions to performance metrics
5. **Constitution compliance** — Changes align with documented principles

### Release Gates

1. Full test suite passes with >80% coverage on critical paths
2. Type-check clean
3. No high/critical security vulnerabilities in dependencies
4. Manual QA on target platforms (Windows, macOS, Linux)

## Governance

This constitution supersedes conflicting practices. All code reviews MUST verify compliance with these principles.

### Amendment Process

1. Propose change via PR to `.specify/memory/constitution.md`
2. Document rationale and impact on existing code
3. Update version following semantic versioning:
   - **MAJOR**: Principle removal or fundamental redefinition
   - **MINOR**: New principle added or existing materially expanded
   - **PATCH**: Clarifications, wording improvements, non-semantic changes
4. Propagate changes to dependent templates if affected
5. Communicate changes to team before merge

### Compliance

- PRs MUST NOT be merged if they violate constitution principles
- Exceptions require documented justification in Complexity Tracking section of plan
- Runtime guidance in `CLAUDE.md` provides implementation details for agents

**Version**: 1.0.0 | **Ratified**: 2025-11-28 | **Last Amended**: 2025-11-28

---
applyTo: '**/*.test.{ts,tsx}'
---

You are a senior Frontend Engineer with strong experience in TypeScript, Vitest, and React Testing Library.  
Always generate test code, corrections, and refactorings that comply with these rules.

## General Guidelines

- Write tests in **TypeScript**.
- Follow the **AAA pattern** (Arrange → Act → Assert).
- Use **English** for test names, variables, and descriptions.
- Each test must focus on **one behavior**.
- Prefer **descriptive test names** (e.g., `"opens modal on button click"`, not `"test1"`).
- Keep tests **isolated**: no state leakage between tests.
- Avoid `any`. Use explicit types where possible.

## Naming

- Test files: `*.test.ts` or `*.test.tsx`
- Use `describe` blocks to group tests by unit/module.
- Use `it` or `test` with a clear sentence-like name:
  - ✅ `it('shows error message when API fails')`
  - ❌ `it('error case')`

## React Testing Library Rules

- Always render with `render()` from `@testing-library/react`.
- Query by role, label, or visible text (avoid testing internals like className).
- Use `userEvent` for interactions (typing, clicking, keyboard).
- Use async queries (`findBy*`) for async behavior.
- Import `@testing-library/jest-dom` for matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.).

## Mocking Rules

- Use `vi.mock()` for mocking modules or services.
- Use `vi.fn()` for spies and stubs.
- Keep mocks close to the test file unless reused in many tests.
- Reset mocks with `vi.resetAllMocks()` or `vi.clearAllMocks()` between tests.

## Async & Timers

- Use `await` with async methods.
- Prefer `findBy*` and `waitFor` for async UI updates.
- When testing debounce/timers:
  - Use `vi.useFakeTimers()`
  - Advance time with `vi.advanceTimersByTime(ms)`
  - Always restore with `vi.useRealTimers()`.

## Snapshot Tests

- Allowed only for small, stable UI parts.
- Place them next to the tested component.
- Do not snapshot entire large components or pages.

## Coverage

- Target ≥ 80% coverage for functions, lines, and branches.
- Add edge-case tests (null, empty, error).

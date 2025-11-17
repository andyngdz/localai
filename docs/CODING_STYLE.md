# Coding Style

- **Language**: TypeScript with ES modules, path aliases (`@/*`, `@types`)
- **Format**: Prettier (2 spaces, single quotes, no semicolons, 100-char width)
- **Naming**:
  - PascalCase for components, camelCase for functions/variables, kebab-case for directories
  - Component names should include feature prefix (e.g., `GeneratorImageRenderer`, `GeneratorImageDownloadButton` for generator feature)
- **Commits**: Conventional format (`feat:`, `fix:`, `test:`, `chore:`)
- **Comments**: Write what code does, not why or how. Keep short and action-focused. Use `// Step N: <action>` for workflows. Avoid redundant explanations. When code is self-documenting (e.g., well-named functions/hooks), omit comments entirely.
- **Simplicity**:
  - Prefer existing simple variables over nested property access (e.g., use `model_id` instead of `modelDetails?.id` when both are available)
  - Only render components when relevant to current state
  - Use direct function references instead of arrow functions when no arguments are needed (e.g., `onPress={openModal}` instead of `onPress={() => openModal()}`)
  - Apply YAGNI (You Aren't Gonna Need It) - don't add features or complexity for hypothetical future needs
  - Use utility functions from `es-toolkit/compat` for cleaner code (e.g., `isEmpty(array)` instead of `array.length === 0`)
  - **Conditional Rendering**: Prefer explicit `if/return` statements over ternary operators for better readability

    ```typescript
    // ✅ Good - explicit and clear
    const content = useMemo(() => {
      if (isEmptyState) {
        return <EmptyState />
      }
      return <Content />
    }, [isEmptyState])

    // ❌ Avoid - nested ternaries are harder to scan
    const content = useMemo(
      () => isEmptyState ? <EmptyState /> : <Content />,
      [isEmptyState]
    )
    ```

  - **Logic Separation**: Extract conditional checks into named variables before using in JSX

    ```typescript
    // ✅ Good - business logic separated from UI
    const isEmptyState = !hasResults && !isEmpty(query)
    return <div>{isEmptyState ? <Empty /> : <Results />}</div>

    // ❌ Avoid - logic mixed with rendering
    return <div>{!hasResults && !isEmpty(query) ? <Empty /> : <Results />}</div>
    ```

- **Modular design**:
  - Break down components and functions into smaller, reusable pieces
  - Keep components focused on a single responsibility
  - Extract presentation logic into separate components (e.g., separate renderer and button components)
  - Container components should orchestrate, presentational components should render
- **Research first**: Check official documentation and existing patterns before implementing new features or using unfamiliar APIs.
- **Type safety**:
  - Never use `any` type. Use proper types, `unknown`, or type assertions (`as Type`) instead
  - Use built-in utility types where appropriate (e.g., `VoidFunction` instead of `() => void`)
  - **Explicit vs Derived Types**: Prefer explicit type names over indexed access types when the type is already exported

    ```typescript
    // ✅ Good - explicit and self-documenting
    interface ComponentProps {
      images: HistoryGeneratedImage[]
    }

    // ❌ Avoid - less clear when type is already exported
    interface ComponentProps {
      images: HistoryItem['generated_images']
    }
    ```

    Note: Indexed access types (`Type['field']`) are still useful for deriving types when no explicit type exists

- **Testing**: Always run tests after refactoring to ensure behavior is preserved
- **State Management**:
  - Use Zustand stores for shared state that needs to be accessed across components
  - Centralize UI state (modal open/close, tab selection) in stores when multiple components need to control it
  - Use local state (`useState`) for component-specific state that doesn't need to be shared
  - When storing UI state in Zustand, use `partialize` to exclude it from persistence (only persist user preferences)
  - For simple persistent state within a single component, prefer `useLocalStorage` from `react-use` over `useRef` when state must survive page reloads
  - **localStorage Key Naming**: Use namespaced keys in the format `feature-name:purpose` to prevent collisions (e.g., `'generator-config-styles:defaults-applied'` instead of `'defaults-applied'`)
  - **Avoid Magic Strings**: Define localStorage keys and other repeated strings as constants to improve maintainability and prevent typos (e.g., `const DEFAULTS_APPLIED_STORAGE_KEY = 'generator-config-styles:defaults-applied'`)
- **Import Organization**:
  - Use barrel exports (index.ts files) for cleaner imports
  - Prefer `from '../constants'` over `from '../constants/specific-file'` when barrel export exists
  - Prefer `from '@/cores/hooks'` over `from '@/cores/hooks/useSpecificHook'` when available
- **Component Structure**:
  - Position hook calls at the very top of functional components (before other hooks or logic)
  - Order: custom hooks first, then UI library hooks (useDisclosure, etc.), then useState/useEffect
- **Performance Optimization**:
  - Use `useMemo` to wrap conditional component rendering to prevent unnecessary re-renders
  - Memoize expensive computations or component selections based on state
  - Use `useMemo` for functions that compute JSX to avoid recalculation on every render
  - Examples:

    ```typescript
    // Conditional rendering
    const content = useMemo(() => {
      if (shouldShowEmpty) {
        return <EmptyState />
      }
      return <ExpensiveComponent data={filteredData} />
    }, [shouldShowEmpty, filteredData])

    // JSX computation function
    const renderValue = useMemo(() => {
      if (Array.isArray(value)) {
        return <div>{value.map(item => <Chip key={item}>{item}</Chip>)}</div>
      }
      return <span>{value}</span>
    }, [value])
    ```

- **es-toolkit Best Practices**:
  - `isEmpty()` is comprehensive - avoid redundant checks like `!value || isEmpty(value)`
  - Prefer empty string `''` over `undefined` for initial string state (more predictable)
  - Single `isEmpty()` check handles all falsy values: `undefined`, `null`, `''`, `[]`, `{}`
  - Example:

    ```typescript
    // ✅ Good - single check, clear default
    const [query, setQuery] = useState('')
    if (isEmpty(query)) return original

    // ❌ Avoid - redundant checks, unclear default
    const [query, setQuery] = useState<string>()
    if (!query || isEmpty(query)) return original
    ```

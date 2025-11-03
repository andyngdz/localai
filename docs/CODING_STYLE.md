# Coding Style

- **Language**: TypeScript with ES modules, path aliases (`@/*`, `@types`)
- **Format**: Prettier (2 spaces, single quotes, no semicolons, 100-char width)
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for directories
- **Commits**: Conventional format (`feat:`, `fix:`, `test:`, `chore:`)
- **Comments**: Write what code does, not why or how. Keep short and action-focused. Use `// Step N: <action>` for workflows. Avoid redundant explanations.
- **Simplicity**: Prefer existing simple variables over nested property access (e.g., use `model_id` instead of `modelDetails?.id` when both are available). Only render components when relevant to current state.
- **Modular design**: Break down components and functions into smaller, reusable pieces. Keep components focused on a single responsibility.
- **Research first**: Check official documentation and existing patterns before implementing new features or using unfamiliar APIs.
- **Type safety**: Never use `any` type. Use proper types, `unknown`, or type assertions (`as Type`) instead.

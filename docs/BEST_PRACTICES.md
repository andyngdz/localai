# Best Practices

**Validate before claiming success:**

- Unit tests passing ≠ code is performant or correct
- Check application logs for warnings and timing
- Test with real workloads when possible

**Question patterns before copying:**

- What problem does this solve?
- Does this apply to my use case?
- What's the performance impact?

**When refactoring:**

- Update tests when behavior/API contracts change
- Prefer editing existing files over creating new ones
- **Component Encapsulation**: Use hooks internally instead of passing derived values as props

  ```typescript
  // ✅ Good - component encapsulates its own dependencies
  export const ImageGrid: FC<{ images: Image[] }> = ({ images }) => {
    const baseURL = useBackendUrl()
    return <div>{/* render images with baseURL */}</div>
  }

  // ❌ Avoid - unnecessary prop drilling
  export const ImageGrid: FC<{ images: Image[]; baseURL: string }> = ({ images, baseURL }) => {
    return <div>{/* render images */}</div>
  }
  ```

**Extract duplicated configuration:**

- Identical configs/options in multiple files → Extract to constants

**Verify API behavior before refactoring:**

- Read official documentation for the API
- Understand return types and possible values
- Don't add defensive code based on assumptions
- Only add guards/checks if behavior actually differs between old/new APIs
- Test cases should match real API behavior, not imagined edge cases

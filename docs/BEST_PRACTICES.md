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
- Simplify tests when implementation simplifies
- Prefer editing existing files over creating new ones

**Extract duplicated configuration:**

- Identical configs/options in multiple files → Extract to constants
- Example: Socket.io options duplicated → `SOCKET_CONFIG` constant in `src/cores/sockets/constants/`

**Verify API behavior before refactoring:**

- Read official documentation for the new API
- Understand return types and possible values
- Don't add defensive code based on assumptions
- Remove guards that are always true/false
- Test cases should match real API behavior, not imagined edge cases

**When replacing one API with another:**

1. Check: What does the old API actually return?
2. Check: What does the new API actually return?
3. Only add guards/checks if behavior actually differs
4. Update tests to match real behavior, not theoretical scenarios

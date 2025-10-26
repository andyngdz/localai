# Critical Rules

**1. TypeScript Type Safety:**

- ❌ **NEVER use `any` type** - no exceptions, including tests
- ✅ Use proper types, `unknown`, or type assertions (`as Type`)
- ✅ For complex scenarios: use `unknown` then narrow with type guards
- ✅ For test mocks: use `as unknown as Type` for proper typing

**2. Socket Event Handling:**

- ❌ `socket.on('event', callback)` - Breaks on socket reconnection
- ✅ `useSocketEvent('event', callback, [callback])` - Reactive and safe

**3. useEffect Cleanup:**

- Must be synchronous - don't use `async () => { await ... }`
- Fire-and-forget for async: `api.cleanup().catch(console.error)`

**4. Test Implementation vs Behavior:**

- ❌ Testing that `socket.on` was called 3 times
- ✅ Testing that component responds correctly to events

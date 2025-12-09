## 1. Implementation

- [ ] 1.1 Update Hires Fix toggle logic to stop unregistering values
- [ ] 1.2 Add/propagate `isHiresFixEnabled` flag outside `hires_fix` form data (UI toggle/request metadata)
- [ ] 1.3 Ensure backend requests omit `hires_fix` when disabled but keep stored values
- [ ] 1.4 Update tests for toggle persistence, flag behavior, and payload shaping
- [ ] 1.5 Update docs/spec references as needed

## 2. Validation

- [ ] 2.1 pnpm test -- path/to/affected/tests (generator config + payload)
- [ ] 2.2 pnpm lint
- [ ] 2.3 pnpm type-check

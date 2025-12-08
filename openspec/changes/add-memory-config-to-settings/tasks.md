## 1. Create Memory Scale Factor Folder

- [ ] 1.1 Create `src/cores/presentations/memory-scale-factor/` directory
- [ ] 1.2 Create `src/cores/presentations/memory-scale-factor/index.ts` for exports

## 2. Refactor MaxMemoryScaleFactorItem

- [ ] 2.1 Add props interface: `value`, `onChange`, `fieldName`, `label`, `description`
- [ ] 2.2 Remove `useFormContext` and `Controller` dependencies
- [ ] 2.3 Move to `src/cores/presentations/memory-scale-factor/MemoryScaleFactorItem.tsx`
- [ ] 2.4 Update tests to use props-based API
- [ ] 2.5 Export from folder index

## 3. Refactor MaxMemoryScaleFactorItems

- [ ] 3.1 Add props interface: `gpuScaleFactor`, `ramScaleFactor`, `onGpuChange`, `onRamChange`
- [ ] 3.2 Pass props to child `MemoryScaleFactorItem` components
- [ ] 3.3 Move to `src/cores/presentations/memory-scale-factor/MemoryScaleFactorItems.tsx`
- [ ] 3.4 Update tests to use props-based API
- [ ] 3.5 Export from folder index

## 4. Refactor MaxMemoryScaleFactorPreview

- [ ] 4.1 Add props interface: `gpuScaleFactor`, `ramScaleFactor`
- [ ] 4.2 Remove `useFormContext` and `useWatch` dependencies
- [ ] 4.3 Move to `src/cores/presentations/memory-scale-factor/MemoryScaleFactorPreview.tsx`
- [ ] 4.4 Update tests to use props-based API
- [ ] 4.5 Export from folder index

## 5. Export from Cores Presentations

- [ ] 5.1 Re-export memory-scale-factor from `src/cores/presentations/index.ts`

## 6. Update Setup Flow Container

- [ ] 6.1 Update `MaxMemoryScaleFactor` to import from `@/cores/presentations/memory-scale-factor`
- [ ] 6.2 Pass form values and handlers as props to refactored components
- [ ] 6.3 Verify setup flow still works correctly

## 7. Create Settings Container

- [ ] 7.1 Create `useSettingsMemory` hook with form state and `api.setMaxMemory()` sync
- [ ] 7.2 Create `SettingsMemoryConfig` container component
- [ ] 7.3 Add `SettingsMemoryConfig` to `GeneralSettings.tsx`
- [ ] 7.4 Add tests for settings memory configuration

## 8. Cleanup

- [ ] 8.1 Remove old component files from `src/features/max-memory-scale-factor/presentations/`
- [ ] 8.2 Update feature index exports
- [ ] 8.3 Run full test suite to verify no regressions

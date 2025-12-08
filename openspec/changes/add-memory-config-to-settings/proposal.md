# Change: Add Memory Config Slider to Settings Modal

## Why

Users currently can only configure memory allocation (GPU/RAM scale factors) during initial setup. After setup, there's no way to adjust these values without re-running the setup flow. Adding memory configuration to the Settings modal enables users to fine-tune memory limits at any time.

## What Changes

### 1. Refactor Memory Components to Accept Props

Create new folder `src/cores/presentations/memory-scale-factor/` and refactor existing components to remove `useFormContext` dependency:

```
src/cores/presentations/memory-scale-factor/
├── MemoryScaleFactorItem.tsx
├── MemoryScaleFactorItems.tsx
├── MemoryScaleFactorPreview.tsx
└── index.ts
```

| Component                  | New Props                                                        |
| -------------------------- | ---------------------------------------------------------------- |
| `MemoryScaleFactorItem`    | `value`, `onChange`, `fieldName`, `label`, `description`         |
| `MemoryScaleFactorItems`   | `gpuScaleFactor`, `ramScaleFactor`, `onGpuChange`, `onRamChange` |
| `MemoryScaleFactorPreview` | `gpuScaleFactor`, `ramScaleFactor`                               |

### 2. Update Setup Flow Container

Update `MaxMemoryScaleFactor` (setup screen) to pass props from its `useForm` to the refactored components.

### 3. Create Settings Container

Create `SettingsMemoryConfig` in settings feature with its own form state and auto-save behavior.

## Impact

- Affected specs: New capability `settings-memory-config`
- Affected code:
  - `src/cores/presentations/memory-scale-factor/` - New reusable memory components folder
  - `src/features/max-memory-scale-factor/presentations/MaxMemoryScaleFactor.tsx` - Update to pass props
  - `src/features/settings/presentations/SettingsMemoryConfig.tsx` - New container
  - `src/features/settings/presentations/tabs/GeneralSettings.tsx` - Add SettingsMemoryConfig

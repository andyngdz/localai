# Tasks

## 1. Update Types

- [ ] Add `device_index: number` to `BackendConfig` interface in `src/types/api.ts`
- [ ] Remove `DeviceIndexResponse` interface
- [ ] Remove `SelectDeviceRequest` interface (keep `MaxMemoryRequest` as-is for request body)

## 2. Update API Service

- [ ] Remove `api.getDeviceIndex()` method from `src/services/api.ts`
- [ ] Update `api.selectDevice()` to use PUT /config/device and return `BackendConfig`
- [ ] Update `api.setMaxMemory()` to use PUT /config/max-memory and return `BackendConfig`

## 3. Update useConfig Hook

- [ ] Add `device_index` to `ConfigResult` interface in `src/cores/hooks/useConfig.ts`
- [ ] Add default value for `device_index` (default: -1 for NOT_FOUND)

## 4. Update HealthCheck Component

- [ ] Replace `api.getDeviceIndex()` with `useConfig().device_index` in `src/features/health-check/presentations/HealthCheck.tsx`

## 5. Update GpuDetection Component

- [ ] Update `api.selectDevice()` call in `src/features/gpu-detection/presentations/GpuDetection.tsx`
- [ ] Consider invalidating config query after device selection

## 6. Update MaxMemoryScaleFactor Component

- [ ] Update `api.setMaxMemory()` call in `src/features/max-memory-scale-factor/presentations/MaxMemoryScaleFactor.tsx`
- [ ] Consider invalidating config query after setting max memory

## 7. Update Tests

- [ ] Update `src/services/__tests__/api.test.ts` - remove getDeviceIndex tests, update selectDevice/setMaxMemory tests
- [ ] Update `src/features/health-check/presentations/__tests__/HealthCheck.test.tsx`
- [ ] Update `src/features/gpu-detection/presentations/__tests__/GpuDetection.test.tsx`
- [ ] Update `src/features/max-memory-scale-factor/presentations/__tests__/MaxMemoryScaleFactor.test.tsx`
- [ ] Update `src/cores/hooks/__tests__/useConfig.test.ts` - add device_index tests

## 8. Verify

- [ ] Run type-check: `pnpm run type-check`
- [ ] Run tests: `pnpm test`
- [ ] Run lint: `pnpm run lint`

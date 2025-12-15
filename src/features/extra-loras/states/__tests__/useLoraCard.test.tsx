import type { GeneratorConfigFormValues } from '@/features/generator-configs'
import { act, renderHook, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLoraCard } from '../useLoraCard'

const createWrapper = (
  initialLoras: GeneratorConfigFormValues['loras'] = []
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const methods = useForm<GeneratorConfigFormValues>({
      defaultValues: {
        loras: initialLoras,
        prompt: '',
        negative_prompt: '',
        cfg_scale: 7.5,
        clip_skip: 1,
        width: 512,
        height: 512,
        number_of_images: 1,
        steps: 20,
        seed: -1,
        sampler: 'euler_a',
        styles: []
      }
    })
    return <FormProvider {...methods}>{children}</FormProvider>
  }
  return Wrapper
}

describe('useLoraCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns default weight of 1 when lora is not in the form', () => {
    const Wrapper = createWrapper([])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    expect(result.current.weight).toBe(1)
  })

  it('returns correct weight when lora exists in the form', () => {
    const Wrapper = createWrapper([
      { lora_id: 1, weight: 0.5 },
      { lora_id: 2, weight: 1.5 }
    ])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    expect(result.current.weight).toBe(0.5)
  })

  it('updates weight for the correct lora', async () => {
    const Wrapper = createWrapper([
      { lora_id: 1, weight: 1 },
      { lora_id: 2, weight: 1.5 }
    ])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    act(() => {
      result.current.setWeight(0.75)
    })

    await waitFor(() => {
      expect(result.current.weight).toBe(0.75)
    })
  })

  it('does not modify other loras when updating weight', async () => {
    const Wrapper = createWrapper([
      { lora_id: 1, weight: 1 },
      { lora_id: 2, weight: 1.5 }
    ])
    const wrapper = Wrapper
    const { result: result1 } = renderHook(() => useLoraCard(1), { wrapper })
    const { result: result2 } = renderHook(() => useLoraCard(2), { wrapper })

    act(() => {
      result1.current.setWeight(0.75)
    })

    await waitFor(() => {
      expect(result2.current.weight).toBe(1.5)
    })
  })

  it('handles weight of 0', () => {
    const Wrapper = createWrapper([{ lora_id: 1, weight: 0 }])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    expect(result.current.weight).toBe(0)
  })

  it('can set weight to 0', async () => {
    const Wrapper = createWrapper([{ lora_id: 1, weight: 1 }])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    act(() => {
      result.current.setWeight(0)
    })

    await waitFor(() => {
      expect(result.current.weight).toBe(0)
    })
  })

  it('handles maximum weight value', async () => {
    const Wrapper = createWrapper([{ lora_id: 1, weight: 1 }])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    act(() => {
      result.current.setWeight(2)
    })

    await waitFor(() => {
      expect(result.current.weight).toBe(2)
    })
  })

  it('preserves decimal precision', async () => {
    const Wrapper = createWrapper([{ lora_id: 1, weight: 1 }])
    const { result } = renderHook(() => useLoraCard(1), { wrapper: Wrapper })

    act(() => {
      result.current.setWeight(1.234567)
    })

    await waitFor(() => {
      expect(result.current.weight).toBe(1.234567)
    })
  })
})

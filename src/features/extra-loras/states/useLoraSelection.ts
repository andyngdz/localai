import { useLorasQuery } from '@/cores/api-queries'
import { GeneratorConfigFormValues } from '@/features/generator-configs'
import type { LoRA } from '@/types'
import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

export const useLoraSelection = () => {
  const { setValue, watch } = useFormContext<GeneratorConfigFormValues>()
  const loras = watch('loras', [])
  const { data } = useLorasQuery()

  const addLora = useCallback(
    (lora: LoRA) => {
      const exists = loras.some((l) => l.lora_id === lora.id)
      if (!exists) {
        setValue('loras', [...loras, { lora_id: lora.id, weight: 1.0 }])
      }
    },
    [loras, setValue]
  )

  const removeLora = useCallback(
    (loraId: number) => {
      setValue(
        'loras',
        loras.filter((l) => l.lora_id !== loraId)
      )
    },
    [loras, setValue]
  )

  const updateWeight = useCallback(
    (loraId: number, weight: number) => {
      setValue(
        'loras',
        loras.map((l) => (l.lora_id === loraId ? { ...l, weight } : l))
      )
    },
    [loras, setValue]
  )

  const selectedLoras = useMemo(() => {
    if (!data?.loras) return []
    return loras
      .map((l) => data.loras.find((lora) => lora.id === l.lora_id))
      .filter(Boolean) as LoRA[]
  }, [loras, data])

  const weights = useMemo(() => {
    return loras.reduce(
      (acc, l) => {
        acc[l.lora_id] = l.weight
        return acc
      },
      {} as Record<number, number>
    )
  }, [loras])

  return { selectedLoras, weights, addLora, removeLora, updateWeight }
}

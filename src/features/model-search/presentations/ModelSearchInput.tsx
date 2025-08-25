import { Input } from '@heroui/react'
import { useFormContext } from 'react-hook-form'
import { ModelSearchFormValues } from '../types'

export const ModelSearchInput = () => {
  const { register } = useFormContext<ModelSearchFormValues>()

  return <Input variant="flat" {...register('query')} />
}

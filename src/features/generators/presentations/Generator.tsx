'use client'

import { GeneratorAction } from '@/features/generator-actions'
import { GeneratorConfig, GeneratorConfigFormValues } from '@/features/generator-configs'
import { GeneratorPreviewer } from '@/features/generator-previewers'
import { GeneratorPrompt } from '@/features/generator-prompts'
import { Histories } from '@/features/histories'
import { Allotment } from 'allotment'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useFormValuesStore, useGenerator } from '../states'
import clsx from 'clsx'

import 'allotment/dist/style.css'

export const Generator = () => {
  const { values, setValues } = useFormValuesStore()
  const methods = useForm<GeneratorConfigFormValues>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: values,
    values
  })
  const [mounted, setMounted] = useState(false)
  const { onGenerate } = useGenerator()

  // Update Zustand store when form values change
  useEffect(() => {
    const subscription = methods.watch((formValues) => {
      setValues(formValues as GeneratorConfigFormValues)
    })

    return () => subscription.unsubscribe()
  }, [methods, setValues])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <FormProvider {...methods}>
      <form
        name="generator"
        onSubmit={methods.handleSubmit(onGenerate)}
        className={clsx('w-full h-full opacity-0 transition-opacity', {
          'opacity-100': mounted
        })}
      >
        <Allotment defaultSizes={[300, 0]}>
          <Allotment.Pane maxSize={350} minSize={300} preferredSize={300}>
            <GeneratorConfig />
          </Allotment.Pane>
          <Allotment.Pane className="flex flex-col">
            <GeneratorPrompt />
            <GeneratorAction />
            <GeneratorPreviewer />
          </Allotment.Pane>
          <Allotment.Pane className="flex flex-col">
            <Histories />
          </Allotment.Pane>
        </Allotment>
      </form>
    </FormProvider>
  )
}

'use client'

import { GeneratorAction } from '@/features/generator-actions'
import { GeneratorConfig, GeneratorConfigFormValues } from '@/features/generator-configs'
import { GeneratorPreviewer } from '@/features/generator-previewers'
import { GeneratorPrompt } from '@/features/generator-prompts'
import { Histories } from '@/features/histories'
import { Allotment } from 'allotment'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useFormValuesStore, useGenerator } from '../states'

import 'allotment/dist/style.css'

export const Generator = () => {
  const { values, onSetValues } = useFormValuesStore()
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
      onSetValues(formValues as GeneratorConfigFormValues)
    })

    return () => subscription.unsubscribe()
  }, [methods, onSetValues])

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
        <Allotment defaultSizes={[300, 0, 300]}>
          <Allotment.Pane maxSize={350} minSize={300} preferredSize={300}>
            <GeneratorConfig />
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="flex flex-col">
              <GeneratorPrompt />
              <GeneratorAction />
              <GeneratorPreviewer />
            </div>
          </Allotment.Pane>
          <Allotment.Pane maxSize={350} minSize={300} preferredSize={300}>
            <Histories />
          </Allotment.Pane>
        </Allotment>
      </form>
    </FormProvider>
  )
}

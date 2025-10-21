'use client'

import { GeneratorAction } from '@/features/generator-actions'
import { GeneratorConfig } from '@/features/generator-configs'
import { GeneratorPreviewer } from '@/features/generator-previewers'
import { GeneratorPrompt } from '@/features/generator-prompts'
import { Histories } from '@/features/histories'
import { Allotment } from 'allotment'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { useGenerator, useGeneratorForm } from '../states'

import 'allotment/dist/style.css'

export const Generator = () => {
  const { methods } = useGeneratorForm()
  const { onGenerate } = useGenerator()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return

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

'use client'

import { GeneratorAction } from '@/features/generator-actions'
import { GeneratorConfig } from '@/features/generator-configs'
import { GeneratorPreviewer } from '@/features/generator-previewers'
import { GeneratorPrompt } from '@/features/generator-prompts'
import { Histories } from '@/features/histories'
import { Allotment } from 'allotment'
import { FormProvider } from 'react-hook-form'
import { useGenerator, useGeneratorForm } from '../states'

import { Progress } from '@heroui/react'
import 'allotment/dist/style.css'
import { useMountedState } from 'react-use'

export const Generator = () => {
  const isMounted = useMountedState()
  const mounted = isMounted()
  const { methods } = useGeneratorForm()
  const { onGenerate } = useGenerator()

  if (!mounted)
    return <Progress isIndeterminate aria-label="Loading..." size="sm" />

  return (
    <FormProvider {...methods}>
      <form
        name="generator"
        onSubmit={methods.handleSubmit(onGenerate)}
        className="w-full h-full"
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

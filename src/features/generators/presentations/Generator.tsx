'use client'

import { FullScreenLoader } from '@/cores/presentations'
import { GenerationPhaseStepper } from '@/features/generation-phase-stepper'
import { GeneratorAction } from '@/features/generator-actions'
import { GeneratorConfig } from '@/features/generator-configs'
import { GeneratorPreviewer } from '@/features/generator-previewers'
import { GeneratorPrompt } from '@/features/generator-prompts'
import { Histories } from '@/features/histories'
import { useModelLoadProgressStore } from '@/features/model-load-progress'
import { Progress } from '@heroui/react'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form'
import { useMountedState } from 'react-use'
import { useGenerator, useGeneratorForm } from '../states'

export const Generator = () => {
  const isMounted = useMountedState()
  const mounted = isMounted()
  const { methods } = useGeneratorForm()
  const { onGenerate } = useGenerator()
  const { progress } = useModelLoadProgressStore()

  if (!mounted)
    return <Progress isIndeterminate aria-label="Loading..." size="sm" />

  return (
    <FormProvider {...methods}>
      <div className="relative w-full h-full">
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
              <div className="flex flex-col h-full">
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
        {progress && <FullScreenLoader message={progress.message} />}
        <GenerationPhaseStepper />
      </div>
    </FormProvider>
  )
}

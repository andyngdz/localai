"use client";

import { GeneratorActions } from "@/features/generator-actions";
import { GeneratorConfig, GeneratorConfigFormValues } from "@/features/generator-configs";
import { GeneratorPrompt } from "@/features/generator-prompts";
import { Allotment } from "allotment";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FORM_DEFAULT_VALUES } from "../constants";

import "allotment/dist/style.css";
import { useGenerator } from "../states";

export const Generator = () => {
  const methods = useForm<GeneratorConfigFormValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: FORM_DEFAULT_VALUES,
  });
  const [mounted, setMounted] = useState(false);
  const { onGenerate } = useGenerator();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        name="generator"
        onSubmit={methods.handleSubmit(onGenerate)}
        className={clsx("w-full h-full opacity-0 transition-opacity", {
          "opacity-100": mounted,
        })}
      >
        <Allotment defaultSizes={[300, 0]}>
          <Allotment.Pane maxSize={350} minSize={300} preferredSize={300}>
            <GeneratorConfig />
          </Allotment.Pane>
          <Allotment.Pane>
            <GeneratorPrompt />
            <GeneratorActions />
          </Allotment.Pane>
        </Allotment>
      </form>
    </FormProvider>
  );
};

"use client";

import { GeneratorConfig } from "@/features/generator-configs/presentations/GeneratorConfig";
import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { GeneratorPrompt } from "@/features/generator-prompts/presentations/GeneratorPrompt";
import { Allotment } from "allotment";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FORM_DEFAULT_VALUES } from "../constants";

import "allotment/dist/style.css";

export const Generator = () => {
  const methods = useForm<GeneratorConfigFormValues>({
    mode: "onChange",
    defaultValues: FORM_DEFAULT_VALUES,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <FormProvider {...methods}>
      <div
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
          </Allotment.Pane>
        </Allotment>
      </div>
    </FormProvider>
  );
};

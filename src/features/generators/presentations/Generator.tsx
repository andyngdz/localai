"use client";

import { GeneratorConfig } from "@/features/generator-configs/presentations/GeneratorConfig";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const Generator = () => {
  return (
    <Allotment>
      <Allotment.Pane minSize={300} maxSize={400}>
        <GeneratorConfig />
      </Allotment.Pane>
      <Allotment.Pane>
        <div />
      </Allotment.Pane>
    </Allotment>
  );
};

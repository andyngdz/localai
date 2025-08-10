"use client";

import { GeneratorConfig } from "@/features/generator-configs/presentations/GeneratorConfig";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const Generator = () => {
  return (
    <Allotment>
      <Allotment.Pane minSize={200} maxSize={250}>
        <GeneratorConfig />
      </Allotment.Pane>
      <Allotment.Pane>
        <div />
      </Allotment.Pane>
    </Allotment>
  );
};

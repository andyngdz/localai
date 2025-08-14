"use client";

import { GeneratorConfig } from "@/features/generator-configs/presentations/GeneratorConfig";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const Generator = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
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
          <div />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

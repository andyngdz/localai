import { Button } from "@heroui/react";
import { COMMON_STEPS } from "../constants";

export const GeneratorConfigCommonSteps = () => {
  return (
    <div className="flex">
      {COMMON_STEPS.map((step) => (
        <Button key={step} variant="light" className="text-foreground-500" isIconOnly>
          {step}
        </Button>
      ))}
    </div>
  );
};

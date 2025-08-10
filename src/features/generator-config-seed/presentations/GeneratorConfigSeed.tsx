import { GeneratorConfigFormValues } from "@/features/generator-configs/types/generator-config";
import { Button, Input } from "@heroui/react";
import { Dices } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { seedService } from "../services/seed";

export const GeneratorConfigSeed = () => {
  const { register, setValue } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Seed</span>
      <div className="flex gap-4">
        <Input
          startContent={<span className="text-sm text-foreground-500">Value</span>}
          {...register("seed")}
        />
        <Button
          variant="light"
          onPress={() => {
            setValue("seed", seedService.generate());
          }}
          isIconOnly
        >
          <Dices />
        </Button>
      </div>
    </div>
  );
};

import { NumberInputController } from '@/cores/presentations/NumberInputController';
import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config';
import { Button } from '@heroui/react';
import { Dices } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { seedService } from '../services/seed';

export const GeneratorConfigSeed = () => {
  const { setValue, control } = useFormContext<GeneratorConfigFormValues>();

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="font-semibold text-sm">Seed</span>
      <div className="flex gap-4">
        <NumberInputController
          aria-label="Seed"
          control={control}
          controlName="seed"
          minValue={-1}
          startContent={<span className="text-sm text-foreground-500">Value</span>}
        />
        <Button
          variant="light"
          onPress={() => {
            setValue('seed', seedService.generate(), { shouldValidate: true, shouldTouch: true });
          }}
          isIconOnly
        >
          <Dices />
        </Button>
      </div>
    </div>
  );
};

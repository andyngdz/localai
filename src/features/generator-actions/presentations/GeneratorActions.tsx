import { GeneratorConfigFormValues } from '@/features/generator-configs';
import { Button, Select, SelectItem } from '@heroui/react';
import { useFormContext } from 'react-hook-form';

export const GeneratorActions = () => {
  const { watch, formState } = useFormContext<GeneratorConfigFormValues>();
  const { isValid } = formState;
  const numberOfImages = watch('number_of_images');

  return (
    <div className="flex justify-between gap-4 p-4">
      <Button color="primary" variant="bordered" isDisabled={!isValid} type="submit">
        Generate {numberOfImages} images
      </Button>
      <Select className="max-w-32" defaultSelectedKeys={['grid']} aria-label="View">
        <SelectItem key="grid">Grid View</SelectItem>
        <SelectItem key="list">List View</SelectItem>
      </Select>
    </div>
  );
};

import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config';

export const FORM_DEFAULT_VALUES: GeneratorConfigFormValues = {
  width: 512,
  height: 512,
  hires_fix: false,
  number_of_images: 4,
  steps: 24,
  seed: -1,
  cfg_scale: 7.5,
  styles: [],
  prompt: '',
  negative_prompt: '',
};

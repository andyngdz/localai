export interface GeneratorConfigFormValues {
  width: number;
  height: number;
  hires_fix: boolean;
  number_of_images: number;
  steps: number;
  cfg_scale: number;
  seed: number;
  styles: string[];
  prompt: string;
  negative_prompt: string;
}

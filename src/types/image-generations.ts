import { GeneratorConfigFormValues } from '@/features/generator-configs';

interface ImageGenerationRequest {
  history_id: number;
  config: GeneratorConfigFormValues;
}

interface ImageGenerationItem {
  path: string;
  file_name: string;
}

interface ImageGenerationResponse {
  items: ImageGenerationItem[];
  nsfw_content_detected: boolean[];
}

interface ImageGenerationStepEndResponse {
  index: number;
  current_step: number;
  timestep: number;
  image_base64: string;
}

export type {
  ImageGenerationItem,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ImageGenerationStepEndResponse,
};

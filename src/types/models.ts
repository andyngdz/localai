interface LoadModelRequest {
  id: string;
}

interface LoadModelResponse {
  id: string;
  config: Record<string, unknown>;
  sample_size: number;
}

export type { LoadModelRequest, LoadModelResponse };

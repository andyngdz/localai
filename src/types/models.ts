interface LoadModelRequest {
  id: string;
}

interface LoadModelResponse {
  id: string;
  config: Record<string, unknown>;
  sample_size: number;
}

interface ModelSearchInfo {
  id: string;
  author: string;
  likes: number;
  trending_score?: number;
  downloads: number;
  tags: string[];
  is_downloaded: boolean;
  size_mb?: number;
  description?: string;
}

interface ModelSearchResponse {
  models_search_info: ModelSearchInfo[];
}

export type { LoadModelRequest, LoadModelResponse, ModelSearchInfo, ModelSearchResponse };

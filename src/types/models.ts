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

interface ModelDetailsSibling {
  blob_id: string;
  rfilename: string;
  size: number;
}

interface ModelDetailsResponse {
  author: string;
  created_at: string;
  disabled: boolean;
  downloads_all_time?: number;
  downloads: number;
  gated: string;
  id: string;
  last_modified: string;
  library_name: string;
  likes: number;
  pipeline_tag: string[];
  private: boolean;
  sha: string;
  siblings: ModelDetailsSibling[];
  spaces: string[];
  tags: string[];
}

export type {
  LoadModelRequest,
  LoadModelResponse,
  ModelDetailsResponse,
  ModelDetailsSibling,
  ModelSearchInfo,
  ModelSearchResponse,
};

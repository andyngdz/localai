interface DownloadStepProgressResponse {
  id: string;
  step: number;
  total: number;
}
interface DownloadModelResponse {
  id: string;
  message: string;
  path: string;
}

export type { DownloadStepProgressResponse, DownloadModelResponse };

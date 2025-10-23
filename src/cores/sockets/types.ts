interface DownloadStepProgressResponse {
  id: string
  step: number
  total: number
  downloaded_size: number
  total_downloaded_size: number
  phase: string
  current_file?: string
}
interface DownloadModelResponse {
  id: string
  message: string
  path: string
}

interface DownloadModelStartResponse {
  id: string
}

export type {
  DownloadModelResponse,
  DownloadModelStartResponse,
  DownloadStepProgressResponse
}

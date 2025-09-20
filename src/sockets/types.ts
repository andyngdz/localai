interface DownloadStepProgressResponse {
  id: string
  step: number
  total: number
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
  DownloadStepProgressResponse,
  DownloadModelResponse,
  DownloadModelStartResponse
}

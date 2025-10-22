export enum UpdateStatus {
  Checking = 'checking',
  UpdateAvailable = 'update-available',
  UpdateNotAvailable = 'update-not-available',
  Downloading = 'downloading',
  Downloaded = 'downloaded',
  Error = 'error'
}

export interface UpdateInfo {
  updateAvailable: boolean
  version?: string
  downloading?: boolean
  progress?: number
  error?: string
  status?: UpdateStatus
}

export interface UpdateCheckResult {
  updateAvailable: boolean
  version?: string
}

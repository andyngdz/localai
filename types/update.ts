export interface UpdateInfo {
  updateAvailable: boolean
  version?: string
  downloading?: boolean
  progress?: number
  error?: string
  status?:
    | 'checking'
    | 'update-available'
    | 'update-not-available'
    | 'downloading'
    | 'downloaded'
    | 'error'
}

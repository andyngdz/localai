export interface UpdateInfo {
  updateAvailable: boolean
  version?: string
  downloading?: boolean
  progress?: number
  error?: string
}

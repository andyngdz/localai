export enum BackendStatusLevel {
  Info = 'info',
  Error = 'error'
}
export interface BackendStatusPayload {
  level: BackendStatusLevel
  message: string
}

export type BackendStatusEmitter = (payload: BackendStatusPayload) => void

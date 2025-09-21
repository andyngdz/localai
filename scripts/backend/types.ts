export enum BackendStatusLevel {
  Info = 'info',
  Error = 'error'
}

export interface Command {
  label: string
  command: string
}

export interface BackendStatusPayload {
  level: BackendStatusLevel
  message: string
  commands?: Command[]
}

export type BackendStatusEmitter = (payload: BackendStatusPayload) => void

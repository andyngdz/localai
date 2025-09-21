import { ensurePython311 } from './ensure-python'
import { installUv } from './install-uv'
import { setupBackend } from './setup-backend'
import { BackendStatusEmitter, BackendStatusLevel } from './types'

export interface StartBackendOptions {
  userDataPath: string
}

const createDefaultStatusEmitter = (): BackendStatusEmitter => (payload) => {
  const prefix =
    payload.level === BackendStatusLevel.Error
      ? '[Backend][Error]'
      : '[Backend][Info]'

  console.log(`${prefix} ${payload.message}`)
}

export const startBackend = async ({ userDataPath }: StartBackendOptions) => {
  const emit = createDefaultStatusEmitter()

  try {
    await ensurePython311({ emit })
    await installUv({ emit })
    await setupBackend({ userDataPath, emit })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    emit({
      level: BackendStatusLevel.Error,
      message: `Backend setup failed: ${message}`
    })
  }
}

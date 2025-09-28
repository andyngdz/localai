'use client'

import { useBackendLog } from '../states'

export const BackendLog = () => {
  const { logs } = useBackendLog()

  console.info(logs)

  return <div></div>
}

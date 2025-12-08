'use client'

import { DeviceSelection } from '@/cores/constants'
import { useBackendInitStore } from '@/cores/backend-initialization'
import { useHealthQuery } from '@/cores/api-queries'
import { useConfig } from '@/cores/hooks'
import { SetupLayout } from '@/features/setup-layout/presentations'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useBackendSetupStatus } from '../states/useBackendSetupStatus'
import { HealthCheckContent } from './HealthCheckContent'

export const HealthCheck = () => {
  const router = useRouter()
  const isInitialized = useBackendInitStore((state) => state.isInitialized)
  const { data } = useHealthQuery(isInitialized)
  const isHealthy = !!data
  const { entries } = useBackendSetupStatus()
  const { device_index } = useConfig()

  useEffect(() => {
    if (isHealthy) {
      const isHasDevice = device_index !== DeviceSelection.NOT_FOUND

      if (isHasDevice) {
        router.push('/editor')
      } else {
        router.push('/gpu-detection')
      }
    }
  }, [isHealthy, device_index, router])

  return (
    <SetupLayout
      title="Health Check"
      description="Checking the connection to your LocalAI backend server"
      isNextDisabled={!isHealthy}
    >
      <HealthCheckContent isHealthy={isHealthy} statuses={entries} />
    </SetupLayout>
  )
}

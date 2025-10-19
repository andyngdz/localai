'use client'

import { DeviceSelection } from '@/cores/constants'
import { SetupLayout } from '@/features/setup-layout/presentations'
import { api, useHealthQuery } from '@/services'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useBackendSetupStatus } from '../states/useBackendSetupStatus'
import { HealthCheckContent } from './HealthCheckContent'

export const HealthCheck = () => {
  const router = useRouter()
  const { data } = useHealthQuery()
  const isHealthy = !!data
  const { entries } = useBackendSetupStatus()

  const onCheckDeviceIndex = useCallback(async () => {
    if (isHealthy) {
      const { device_index } = await api.getDeviceIndex()

      if (device_index !== DeviceSelection.NOT_FOUND) {
        router.push('/editor')
      } else {
        router.push('/gpu-detection')
      }
    }
  }, [isHealthy, router])

  useEffect(() => {
    onCheckDeviceIndex()
  }, [onCheckDeviceIndex])

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

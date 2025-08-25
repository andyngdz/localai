'use client'

import { DeviceSelection } from '@/cores/constants'
import { api, useHealthQuery } from '@/services'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { HealthCheckContent } from './HealthCheckContent'
import { SetupLayout } from '@/features/layout/presentations'

export const HealthCheck = () => {
  const router = useRouter()
  const { data } = useHealthQuery()
  const isHealthy = !!data

  const onNext = () => {
    if (isHealthy) {
      router.push('/gpu-detection')
    }
  }

  const onCheckDeviceIndex = useCallback(async () => {
    if (isHealthy) {
      const { device_index } = await api.getDeviceIndex()

      if (device_index !== DeviceSelection.NOT_FOUND) {
        router.push('/editor')
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
      onNext={onNext}
      isNextDisabled={!isHealthy}
    >
      <HealthCheckContent isHealthy={isHealthy} />
    </SetupLayout>
  )
}

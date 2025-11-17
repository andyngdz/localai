'use client'

import { Button } from '@heroui/react'
import { useSettingsStore } from '@/features/settings/states/useSettingsStore'

export const ModelSearchViewDownloadedButton = () => {
  const { openModal } = useSettingsStore()

  return (
    <Button variant="bordered" onPress={() => openModal('models')}>
      Manage this model
    </Button>
  )
}

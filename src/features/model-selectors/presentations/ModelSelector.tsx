'use client'

import { useDownloadedModels } from '@/cores/hooks'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@heroui/react'
import { map } from 'es-toolkit/compat'
import { ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import { useModelSelectors, useModelSelectorStore } from '../states'

export const ModelSelector = () => {
  useModelSelectors()
  const { downloadedModels } = useDownloadedModels()
  const { selected_model_id, setSelectedModelId } = useModelSelectorStore()

  const items = useMemo(() => {
    return map(downloadedModels, (d) => {
      return <DropdownItem key={d.model_id}>{d.model_id}</DropdownItem>
    })
  }, [downloadedModels])

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          color="primary"
          endContent={<ChevronDown size={16} />}
        >
          {selected_model_id}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Model selector"
        selectedKeys={[selected_model_id]}
        selectionMode="single"
        onSelectionChange={(id) => {
          if (id.currentKey) {
            setSelectedModelId(id.currentKey)
          }
        }}
      >
        {items}
      </DropdownMenu>
    </Dropdown>
  )
}

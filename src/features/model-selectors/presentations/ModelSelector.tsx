'use client'

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
import { useModelSelectors } from '../states/useModelSelectors'
import { useModelSelectorStore } from '../states/useModelSelectorStores'

export const ModelSelector = () => {
  const { downloadedModels } = useModelSelectors()
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

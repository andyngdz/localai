'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { map } from 'es-toolkit/compat';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { useModelSelectors } from '../states/useModelSelectors';
import { useModelSelectorStore } from '../states/useModelSelectorStores';

export const ModelSelector = () => {
  const { data } = useModelSelectors();
  const { id, setId } = useModelSelectorStore((state) => state);

  const items = useMemo(() => {
    return map(data, (d) => {
      return <DropdownItem key={d.model_id}>{d.model_id}</DropdownItem>;
    });
  }, [data]);

  if (data) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" color="primary" endContent={<ChevronDown size={16} />}>
            {id}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Model selector"
          selectedKeys={[id]}
          selectionMode="single"
          onSelectionChange={(id) => {
            if (id.currentKey) {
              setId(id.currentKey);
            }
          }}
        >
          {items}
        </DropdownMenu>
      </Dropdown>
    );
  }
};

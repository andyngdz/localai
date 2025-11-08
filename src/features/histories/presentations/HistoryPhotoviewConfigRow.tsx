import { Chip } from '@heroui/react'
import { isEmpty } from 'es-toolkit/compat'
import { FC } from 'react'

interface HistoryPhotoviewConfigRowProps {
  label: string
  value: string | number | string[]
}

export const HistoryPhotoviewConfigRow: FC<HistoryPhotoviewConfigRowProps> = ({
  label,
  value
}) => {
  const renderValue = () => {
    if (Array.isArray(value)) {
      if (isEmpty(value)) {
        return <span className="text-default-500">None</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, index) => (
            <Chip key={`${item}-${index}`} size="sm" variant="flat">
              {item}
            </Chip>
          ))}
        </div>
      )
    }

    return <span className="text-default-700">{value}</span>
  }

  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-default-200">
      <span className="text-default-500 font-medium shrink-0">{label}</span>
      <div className="flex-1 flex justify-end">{renderValue()}</div>
    </div>
  )
}

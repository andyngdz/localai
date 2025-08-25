import { FC } from 'react'
import { AuthorAvatar } from './AuthorAvatar'

export interface ModelWithAvatarProps {
  author: string
  id: string
}

export const ModelWithAvatar: FC<ModelWithAvatarProps> = ({ author, id }) => {
  return (
    <div className="flex items-center gap-3">
      <AuthorAvatar id={author} size="sm" radius="full" alt={id} className="w-4 h-4" isBordered />
      <span className="text-left text-sm">{id}</span>
    </div>
  )
}

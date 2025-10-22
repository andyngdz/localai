import { useBackendUrl } from '@/cores/backend-initialization'
import { Avatar, AvatarProps } from '@heroui/react'
import { FC } from 'react'

export interface AuthorAvatarProps extends AvatarProps {
  id: string
}

export const AuthorAvatar: FC<AuthorAvatarProps> = ({ id, ...props }) => {
  const baseURL = useBackendUrl()

  return <Avatar src={`${baseURL}/users/avatar/${id}.png`} {...props} />
}

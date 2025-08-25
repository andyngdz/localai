import { Avatar, AvatarProps } from '@heroui/react'
import { FC } from 'react'

export interface AuthorAvatarProps extends AvatarProps {
  id: string
}

export const AuthorAvatar: FC<AuthorAvatarProps> = ({ id, ...props }) => {
  return <Avatar src={`http://localhost:8000/users/avatar/${id}.png`} {...props} />
}

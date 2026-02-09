import { Avatar } from '@chakra-ui/react'
import React from 'react'

type avatarType <T> = {
    image:string | null,
    name: string | null
}

export default function AvatarCustom<T>({image , name}:avatarType<T>) {
  return (
    <Avatar.Root>
        {
            image &&
            <Avatar.Image src={image}/>
        }
        
        <Avatar.Fallback name={name || ''}/>
    </Avatar.Root>
  )
}

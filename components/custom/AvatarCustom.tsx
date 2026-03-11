'use client'
import { Avatar } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function AvatarCustom({ name, image }: { name: string, image: string }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Render nothing on server — avoids mismatch
    if (!mounted) return (
        <Avatar.Root>
            <Avatar.Fallback name='' />
        </Avatar.Root>
    )

    return (
        <Avatar.Root>
          {image && <Avatar.Image src={image || ''} />    }
            
            <Avatar.Fallback name={name || ''} />
        </Avatar.Root>
    )
} 
"use client"
import { auth, authsecond } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { StreamChatContextProvider } from '@/context/streamChatContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LayoutAdmins({ children }: { children: React.ReactNode }) {
  

    return (
  
            <VStack className={'admin'} width={'100%'} height={'100%'}>
                {children}
            </VStack>
    )
}
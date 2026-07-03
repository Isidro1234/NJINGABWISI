"use client"
import { auth, authsecond } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { StreamChatContextProvider } from '@/context/streamChatContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const StripeContextProvider = dynamic(() => import("../../../context/strinpeContext"))
const LoadingAnim = dynamic(() => import("../../../components/custom/LoadingAnim"))
const NavBarLogged = dynamic(() => import("../../../components/custom/NavBarLogged"))

export default function PortalLayout({ children }: { children: React.ReactNode }) {
   

    return (
      
                <VStack className='portal' width={'100%'} height={'100%'} bg={'#f6f6f6'}>
                    <NavBarLogged />
                    {children}
                </VStack>

    )
}
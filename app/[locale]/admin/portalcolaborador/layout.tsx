"use client"
import LoadingAnim from '@/components/custom/LoadingAnim'
import NavBarAdminLogged from '@/components/custom/NavbarAdminLogged'
import NavBarLoggedAuthSecond from '@/components/custom/NavbarLoggedAuthSecond'
import { auth, authsecond } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LayoutAdminColaborador({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <VStack width={'100%'}>
            <VStack className='admin' width={'100%'}>
                <NavBarLoggedAuthSecond/>
                {children}
            </VStack>
        </VStack>
    )
}
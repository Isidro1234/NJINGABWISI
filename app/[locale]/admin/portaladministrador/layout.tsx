"use client"
import LoadingAnim from '@/components/custom/LoadingAnim'
import NavBarAdminLogged from '@/components/custom/NavbarAdminLogged'
import { auth, authsecond } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LayoutAdminPortal({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false)
    const { setUserdata }: any = useAuthContext()

    useEffect(() => {
        const handleAuth = (user: any) => {
            if (!user) return

            const userdata = localStorage.getItem('uipadmin')
            const uip = localStorage.getItem('uip')

            if (uip && !userdata) {
                router.push('/portal')
                return
            }

            if (!userdata) return

            const decrypt = decryptdata(userdata)
            if (!decrypt) return

            setUserdata(decrypt)

            if (decrypt?.role === 'admin' || decrypt?.role === 'colaborator') {
                setIsLogged(true)
            } else {
                router.push('/admin')
            }
        }

        const unsub1 = onAuthStateChanged(auth, handleAuth)
        const unsub2 = onAuthStateChanged(authsecond, handleAuth)

        return () => {
            unsub1()
            unsub2()
        }
    }, [])

    if (!isLogged) {
        return (
            <VStack width={'100%'} height={'100%'} bg={'white'}>
                <LoadingAnim />
            </VStack>
        )
    }

    return (
        <VStack className='admin' width={'100%'}>
            <NavBarAdminLogged />
            {children}
        </VStack>
    )
}
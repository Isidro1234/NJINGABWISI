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
    const router = useRouter()
    const { setUserdata }: any = useAuthContext()
    const [userdatauip, setuipdata] = useState<any>([])

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
            setuipdata(decrypt)

            if (decrypt?.role === 'admin') {
                router.push('/admin/portaladministrador')
            } else if (decrypt?.role === 'colaborator') {
                router.push('/admin/portalcolaborador')
            }
        }

        const unsub1 = onAuthStateChanged(auth, handleAuth)
        const unsub2 = onAuthStateChanged(authsecond, handleAuth)

        return () => {
            unsub1()
            unsub2()
        }
    }, [])

    return (
        <StreamChatContextProvider
            userID={userdatauip?.id?.slice(0, 5)}
            name={userdatauip?.nome}
            image={userdatauip?.photo || ''}
        >
            <VStack className={'admin'} width={'100%'} height={'100%'}>
                {children}
            </VStack>
        </StreamChatContextProvider>
    )
}
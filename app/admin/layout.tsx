"use client"
import { auth } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { StreamChatContextProvider } from '@/context/streamChatContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LayoutAdmins({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const { setUserdata }: any = useAuthContext()
    const [userdatauip, setuipdata] = useState<any>([])
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) return  // not logged in — stay on login page

            const userdata: string = localStorage.getItem('uipadmin') || ''
            const uip: string = localStorage.getItem('uip') || ''

            // Normal user — redirect to user portal
            if (uip && !userdata) {
                auth.signOut()
                router.push('/portal')
                return
            }

            // No credentials at all — sign out
            if (!userdata) {
                auth.signOut()
                return
            }

            const decrypt = decryptdata(userdata)
            if (!decrypt) return
            setuipdata(decrypt)
            setUserdata(decrypt)

            if (decrypt?.role === 'admin') {
                router.push('/admin/portaladministrador')
            } else if (decrypt?.role === 'collaborator') {
                router.push('/admin/portalcolaborador')
            }
        })

        return () => unsubscribe()  // ✅ cleanup
    }, [])

    return (
      <StreamChatContextProvider
                  userID={userdatauip?.id?.slice(0,5)}
                  name={userdatauip?.nome}
                  image={userdatauip?.photo || ''}
                >
                 <VStack width={'100%'} height={'100%'} bg={'#d33434'}>
            {children}
        </VStack> 
      </StreamChatContextProvider>
        
    )
}
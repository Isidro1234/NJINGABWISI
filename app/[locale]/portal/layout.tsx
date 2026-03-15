'use client'
import { auth } from '@/config/firebse'
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

export default function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false)
    const { setUserdata }: any = useAuthContext()
    const [userdatauip, setuipdata] = useState<any>([])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/auth/entrar')
                return
            }

            const userdata: string = localStorage.getItem('uip') || ''
            const userdataadmin: string = localStorage.getItem('uipadmin') || ''

            // No user data — sign out
            if (!userdata) {
                auth.signOut()
                router.push('/auth/entrar')
                return
            }

            // Admin/collaborator logged in — redirect away from user portal
            if (userdataadmin) {
                const decryptAdmin = decryptdata(userdataadmin)
                if (decryptAdmin?.role === 'admin') {
                    router.push('/admin/portaladministrador')
                    return
                } else if (decryptAdmin?.role === 'collaborator') {
                    router.push('/admin/portalcolaborador')
                    return
                }
            }

            // Normal user — allow access
            const decrypt = decryptdata(userdata)
            if (!decrypt) {
                auth.signOut()
                router.push('/auth/entrar')
                return
            }
            setuipdata(decrypt)
            setUserdata(decrypt)
            setIsLogged(true)
        })

        return () => unsubscribe()  // ✅ cleanup
    }, [])

    if (!isLogged) {
        return <LoadingAnim />
    }

    return (
        <StripeContextProvider>
          <StreamChatContextProvider
            userID={userdatauip?.id?.slice(0,5)}
            name={userdatauip?.nome}
            image={userdatauip?.photo || ''}
          >
            <VStack className='portal' width={'100%'} height={'100%'} bg={'#f6f6f6'}>
                <NavBarLogged />
                {children}
            </VStack>
          </StreamChatContextProvider>
            
        </StripeContextProvider>
    )
}
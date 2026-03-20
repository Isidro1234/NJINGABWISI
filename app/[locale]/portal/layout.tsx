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
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false)
    const { setUserdata }: any = useAuthContext()
    const [userdatauip, setuipdata] = useState<any>([])

    useEffect(() => {
        const handleAuth = (user: any) => {
            if (!user) {
                router.push('/auth/entrar')
                return
            }

            const userdata = localStorage.getItem('uip')
            const userdataadmin = localStorage.getItem('uipadmin')

            if (!userdata) {
                router.push('/auth/entrar')
                return
            }

            if (userdataadmin) {
                const decryptAdmin = decryptdata(userdataadmin)

                if (decryptAdmin?.role === 'admin') {
                    router.push('/admin/portaladministrador')
                    return
                } else if (decryptAdmin?.role === 'colaborator') {
                    router.push('/admin/portalcolaborador')
                    return
                }
            }

            const decrypt = decryptdata(userdata)
            if (!decrypt) return

            setUserdata(decrypt)
            setuipdata(decrypt)
            setIsLogged(true)
        }

        const unsub1 = onAuthStateChanged(auth, handleAuth)
        const unsub2 = onAuthStateChanged(authsecond, handleAuth)

        return () => {
            unsub1()
            unsub2()
        }
    }, [])

    if (!isLogged) return <LoadingAnim />

    return (
        <StripeContextProvider>
            <StreamChatContextProvider
                userID={userdatauip?.id?.slice(0, 5)}
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
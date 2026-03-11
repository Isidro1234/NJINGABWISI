"use client"
import LoadingAnim from '@/components/custom/LoadingAnim'
import NavBarAdminLogged from '@/components/custom/NavbarAdminLogged'
import { auth } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function LayoutAdminColaborador({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false)
    const { setUserdata }: any = useAuthContext()

    useEffect(() => {
        // ✅ Unsubscribe on unmount
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/admin')
                return
            }

            const userdata: string = localStorage.getItem('uipadmin') || ''
            const uip: string = localStorage.getItem('uip') || ''

            // Normal user — redirect to user portal
            if (uip && !userdata) {
                auth.signOut()
                router.push('/portal')
                return
            }

            // No admin data — sign out
            if (!userdata) {
                auth.signOut()
                router.push('/admin')
                return
            }

            const decrypt = decryptdata(userdata)
            if (!decrypt) {
                auth.signOut()
                router.push('/admin')
                return
            }

            setUserdata(decrypt)

            if (decrypt?.role === 'collaborator') {
                setIsLogged(true)  // ✅ only collaborators can see this layout
            } else if (decrypt?.role === 'admin') {
                router.push('/admin/portaladministrador')  // ✅ redirect admins away
            } else {
                auth.signOut()
                router.push('/admin')
            }
        })

        return () => unsubscribe()  // ✅ cleanup
    }, [])

    if (!isLogged) {
        return (
            <VStack width={'100%'} height={'100%'} bg={'white'}>
                <LoadingAnim />
            </VStack>
        )
    }

    return (
        <VStack width={'100%'} height={'100%'} bg={'#f6f6f6'}>
            <VStack className='portal' width={'100%'} height={'100%'}>
                <NavBarAdminLogged />
                {children}
            </VStack>
        </VStack>
    )
}
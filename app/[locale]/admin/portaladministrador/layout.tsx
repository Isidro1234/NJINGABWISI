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

export default function LayoutAdminPortal({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false)
    const { setUserdata }: any = useAuthContext()

    useEffect(() => {
        // ✅ Store unsubscribe function to clean up on unmount
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/admin')
                return
            }

            const userdata: string = localStorage.getItem('uipadmin') || ''
            const uip: string = localStorage.getItem('uip') || ''

            // Normal user logged in — redirect to user portal
            if (uip && !userdata) {
                auth.signOut()
                router.push('/portal')
                return
            }

            // No admin data found — sign out
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
            
            // ✅ Only set logged AFTER all checks pass
            if (decrypt?.role === 'admin' || decrypt?.role === 'collaborator') {
                setIsLogged(true)
            } else {
                auth.signOut()
                router.push('/admin')
            }
        })

        // ✅ Cleanup — unsubscribe when component unmounts
        return () => unsubscribe()
    }, []) // ✅ empty deps — only run once on mount

    if (!isLogged) {
        return (
            <VStack width={'100%'} height={'100%'} bg={'white'}>
                <LoadingAnim />
            </VStack>
        )
    }

    return (
        <VStack className='admin' width={'100%'} >
            <NavBarAdminLogged />
            {children}
        </VStack>
    )
}
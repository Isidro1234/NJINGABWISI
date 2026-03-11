"use client"
import { auth, authsecond } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function RootLayoutMessage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
     const router = useRouter()
        const { setUserdata }: any = useAuthContext()
    
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) return 
    
                const userdata: string = localStorage.getItem('uipadmin') || ''
                const uip: string = localStorage.getItem('uip') || ''
    
                if (uip && !userdata) {
                    authsecond.signOut()
                    return
                }
    
                if (!userdata) {
                    auth.signOut()
                    return
                }
                if(!uip && !userdata){
                    router.back()
                }
                const decrypt = decryptdata(userdata)
                if (!decrypt) return
    
                setUserdata(decrypt)
    
            })
    
            return () => unsubscribe()  // ✅ cleanup
        }, [])
    
    
    return (
    <VStack width={'100%'} height={'100%'}>
        {children}
    </VStack>
  )
}

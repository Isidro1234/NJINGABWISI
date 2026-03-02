"use client"
import LoadingAnim from '@/components/custom/LoadingAnim';
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function LayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
      const router = useRouter()
      const [isLogged, setIsLogged] = useState(false);
      const {setUserdata}:any = useAuthContext();
      useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            try {
                        if(user){
                    const userdata:string = localStorage.getItem('admin') || '';
                    const decrypt = decryptdata(userdata)
                    setUserdata(decrypt || {})
                    setIsLogged(true)
                    redirect('/admin/portaladministrador')
                }
            } catch (error) {
                 router.push('/admin/auth')
            }
          
        })
      }, [isLogged])
    return (
        <VStack width={'100%'} height={'100%'} bg={'#d33434'}>
            {children}
        </VStack>
    )
}

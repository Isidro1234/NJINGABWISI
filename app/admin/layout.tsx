"use client"
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function LayoutAdmins({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const router = useRouter()
  const {setUserdata}:any = useAuthContext();
  useEffect(()=>{
     onAuthStateChanged(auth, (user)=>{
          if(user){
             const userdata:string = localStorage.getItem('uipadmin') || '';
             const uip:string = localStorage.getItem('uip') || ''
             if(!userdata && !uip){
                auth.signOut()
                return;
             }
             if(uip){
                router.push('/portal')
                return
             }
             const decrypt = decryptdata(userdata)
             setUserdata(decrypt || {})
             if(decrypt?.role === "admin"){
              router.push('/admin/portaladministrador')
             }else if (decrypt?.role === "collaborator"){
              router.push('/admin/portalcolaborador')
             }
          }
       })
  }, [])
   

    
    return (
        <VStack width={'100%'} height={'100%'} bg={'#d33434'}>
            {children}
        </VStack>
    )
}

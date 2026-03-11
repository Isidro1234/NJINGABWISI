"use client"
import LoadingAnim from '@/components/custom/LoadingAnim';
import NavBarAdminLogged from '@/components/custom/NavbarAdminLogged';
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

export default function LayoutAdminColaborador({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){ 
    const router = useRouter()
    const [isLogged, setIsLogged] = useState(false);
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
                 setIsLogged(true)
                 if(decrypt?.role === "admin"){
                  return;
                 }else if (decrypt?.role === "collaborator"){
                  router.push('/admin/portalcolaborador')
                 }
              }else{
                 router.push('/admin')
              }
           })
      }, [])
    if(!isLogged){
        return(
           <VStack width={'100%'} height={"100%"} bg={'white'}>
                <LoadingAnim/> 
            </VStack>
        )
    }
    return (
    <VStack width={'100%'} height={'100%'} bg={'#f6f6f6'}>
        <VStack className='portal' width={'100%'} height={'100%'} >
            <NavBarAdminLogged/>
            {children}
        </VStack>
    </VStack>
  )
}

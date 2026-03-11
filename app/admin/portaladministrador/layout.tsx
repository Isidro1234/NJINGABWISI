"use client"
import LoadingAnim from '@/components/custom/LoadingAnim';
import NavBarAdminLogged from '@/components/custom/NavbarAdminLogged';
import NavBarLogged from '@/components/custom/NavBarLogged';
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'

export default function LayoutAdminPortal({
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
                       router.push('/admin/portaladministrador')
                     }else if (decrypt?.role === "collaborator"){
                      return;
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
    <VStack className='portal'  width={'100%'} height={'100%'} bg={'#f6f6f6'}>
            <NavBarAdminLogged/>
            {children}
    </VStack>
  )
}

'use client'
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { decryptdata } from '@/logic/encryptdata';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const StripeContextProvider = dynamic(
  () => import("../../context/strinpeContext"),
);
const LoadingAnim = dynamic(
  () => import("../../components/custom/LoadingAnim"),
);
const NavBarLogged = dynamic(
  () => import("../../components/custom/NavBarLogged"),
);
export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(false);
  const {setUserdata}:any = useAuthContext();
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
       if(user){
          const userdata:string = localStorage.getItem('uip') || '';
          const decrypt = decryptdata(userdata)
          setUserdata(decrypt || {})
          setIsLogged(true)
       }else{
          router.push('/auth/entrar')
       }
    })
  }, [isLogged])
  if(!isLogged){
    return(<LoadingAnim/>)
  }
 
  return (
    <StripeContextProvider> 
      <VStack className='portal' width={'100%'} height={'100%'}>
        <NavBarLogged/>
        {children}
      </VStack>
    </StripeContextProvider>
  )
}

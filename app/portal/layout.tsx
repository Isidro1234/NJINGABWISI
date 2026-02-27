'use client'
import LoadingAnim from '@/components/custom/LoadingAnim';
import NavBarLogged from '@/components/custom/NavBarLogged';
import { auth } from '@/config/firebse';
import { useAuthContext } from '@/context/authContext';
import { VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const [isLogged, setIsLogged] = useState(false);
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
       if(user){
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
    <VStack className='portal' width={'100%'} height={'100%'}>
      <NavBarLogged/>
      {children}
    </VStack>
  )
}

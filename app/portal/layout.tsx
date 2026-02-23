'use client'
import LoadingAnim from '@/components/custom/LoadingAnim';
import NavBarLogged from '@/components/custom/NavBarLogged';
import { useAuthContext } from '@/context/authContext';
import { VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const {isUserLogged, isLoading,}:any = useAuthContext();
  useEffect(()=>{
    if( !isLoading && !isUserLogged){
        router.push('/auth/entrar')
    }
  }, [isUserLogged])
  if(!isUserLogged){
    return(<LoadingAnim/>)
  }
  return (
    <VStack width={'100%'} height={'100%'}>
      <NavBarLogged/>
      {children}
    </VStack>
  )
}

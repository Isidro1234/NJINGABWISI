"use client"
import { auth } from '@/config/firebse';
import { useStateAuth } from '@/states/useAuthState'
import { Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Perfil() {
    const sair = useStateAuth((state:any)=>state.logout);
  return (
    <VStack width={'100%'} height={'100%'} bg={'#f6f6f6'}>
        <Text>{auth.currentUser?.displayName}</Text>
        <Text onClick={sair}>Sair</Text>
    </VStack>
  )
}

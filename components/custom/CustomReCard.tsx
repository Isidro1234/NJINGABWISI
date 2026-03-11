"use client"
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'
import SelectCustom from './SelectCustom'
import SelectCustomValue from './SelectCustomValue'
import { useRouter } from 'next/navigation'

export default function CustomReCard() {
  const router = useRouter()
  return (
    <VStack width={'100%'} alignItems={'center'} justifyContent={'center'}>
       <Text fontWeight={400} textAlign={'center'} fontSize={12} color={'gray'}>Registre seu imovel com apenas um clique. 
        Clique a baixo para ir a pagina de registro de imóveis</Text>
       <Button onClick={()=>{router.push('/portal/Registrar')}}  fontSize={11} color={'white'} bg={'#2F61BC'} borderRadius={50}>Registrar Imóvel</Button>
    </VStack>
  )
}

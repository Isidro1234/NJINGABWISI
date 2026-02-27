"use client"
import InputLabel from '@/components/custom/InputLabel';
import { auth } from '@/config/firebse';
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image';
import React from 'react'

export default function Perfil() {
    const sair = useStateAuth((state:any)=>state.logout);
  return (
    <VStack padding={10} width={'100%'} height={'100%'} bg={'#f6f6f6'}>
        <VStack alignItems={'flex-start'} bg={'white'} padding={10} borderRadius={20}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                        <Box position={'relative'} borderRadius={50} width={75} height={75} bg={'#f6f6f6'}>
                            <Image fill style={{borderRadius:50, objectFit:'cover', height:'100%', width:'100%'}} alt='avatar' src={'/icons/avatar.svg'} />
                        </Box>
                        <Text fontSize={12} color={'gray'}>@{auth.currentUser?.displayName}</Text>
                        
            </Box>
            <InputLabel label='Profissao' type='text' onchange={(e:any)=>{console.log(e)}} placeholder='Profissao'/>
            <VStack alignItems={'flex-start'}>
                <Text fontSize={12} color={'gray'}>Quer ser agente Imobiliario?</Text>
               <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'} bg={'transparent'} fontWeight={400} color='gray' onClick={sair}>
                aplicar</Button> 
            </VStack>
            
            <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'} bg={'transparent'} color='red' onClick={sair}>Sair</Button>
        </VStack>
        
    </VStack>
  )
}

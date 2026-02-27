'use client'
import { Box, HStack, QrCode, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import CustomQrcode from './CustomQrcode'

export default function CustomMeuUIP({userdata}:any) {
  return (
    <HStack gap={4} alignItems={'flex-start'} width={'100%'}>
        <Box flex={1} height={'100px'} position={'relative'}>
            <Image fill style={{borderRadius:20, objectFit:'contain', height:'100%', width:'100%'}}
             src={userdata?.avatar || '/icons/avatar.svg'} alt='avatar'/>
        </Box>
        <VStack alignItems={'flex-start'} flex={1}>
            <Text color={'gray.500'} fontSize={10}>{userdata?.nome}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.moradia}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.estado}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.shortuip_id}</Text>
        </VStack>
        <Box >
           <CustomQrcode value={`https://n-jinga.vercel.app/verifyuip/${userdata?.id}` || 'N/A'}/>
        </Box>
    </HStack>
  )
}

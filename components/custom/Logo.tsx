'use client'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <HStack className='logo'>
        <Box position={'relative'}>
          <Image className='image' style={{zIndex:500}} width={50} height={50}
           src={'/icons/angola-flag.svg'} alt='angola-flag'/>
          <Box className='background-inner'>
          </Box>  
        </Box>
        <VStack className='logo-text-conteiner'>
            <Text className='logo-main-text' fontSize={35} lineHeight={.9} fontWeight={700}><span className='logo-text-1'>N</span><span className='logo-text-2'>J</span>
                <span className='logo-text-3'>I</span>NGA</Text>
            <Text className='logo-subtext'>Portal de registo digital de casas</Text>  
        </VStack>            
    </HStack>
  )
}

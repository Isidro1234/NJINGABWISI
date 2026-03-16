'use client'
import { Box, HStack, Span, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logo() {
  const router = useRouter()
  return (
    <HStack className='logo' onClick={()=>{router.push('/')}}>
        <Box position={'relative'}>
          <Image className='image' style={{zIndex:500}} width={50} height={50}
           src={'/icons/angola-flag.svg'} alt='angola-flag'/>
          <Box className='background-inner'>
          </Box>  
        </Box>
        <VStack className='logo-text-conteiner'>
            <Text className='logo-main-text' _dark={{color:'white'}} fontSize={35} lineHeight={.9} fontWeight={700}><Span className='logo-text-1'>N</Span><Span className='logo-text-2'>J</Span>
                <Span className='logo-text-3' _dark={{color:'white'}}>I</Span >NGA</Text>
            <Text className='logo-subtext'  _dark={{color:'#b4b4b4'}}>Portal de registo digital de casas</Text>  
        </VStack>            
    </HStack>
  )
}

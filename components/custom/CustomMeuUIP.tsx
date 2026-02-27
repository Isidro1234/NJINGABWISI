'use client'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export default function CustomMeuUIP() {
  return (
    <HStack gap={4} alignItems={'flex-start'}>
        <Box width={100} height={100}>
            <Image style={{borderRadius:20}} src={'/icons/avatar-placeholder.svg'} alt='avatar' width={100} height={100}/>
        </Box>
        <VStack alignItems={'flex-start'}>
            <Text color={'gray.500'} fontSize={10}>Isidro Zau</Text>
            <Text color={'gray.500'} fontSize={10}>Houston, Texas</Text>
            <Text color={'gray.500'} fontSize={10}>Active</Text>
            <Text color={'gray.500'} fontSize={10}>PA60</Text>
        </VStack>
        <Box width={100} height={100}>

        </Box>
    </HStack>
  )
}

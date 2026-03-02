"use client"
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Arrow from '../../public/icons/arrow-right-icon.svg'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'

export default function CustomCard({children , icon , bg , title, description, link}:{children:React.ReactNode, 
    icon?:React.ReactNode, bg?:string, title?:string, description?:string, link?:string}) {
        const router = useRouter()
  return (
    <VStack borderRadius={20} bg={'white'}  alignItems={'flex-start'} padding={8}>
        <HStack gap={5} width={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
            <HStack flex={1} justifyContent={'flex-start'} alignItems={'center'}>
                <Box display={'flex'} width={'55px'} height={'55px'} borderRadius={50} 
                bg={bg ? bg : '#f6f6f6'} alignItems={'center'} justifyContent={'center'}>
                    {icon}
                </Box>
                <VStack gap={0} alignItems={'flex-start'}>
                    <Heading fontWeight={400} color={'#4B4345'} lineHeight={1.2} fontSize={17}>{title}</Heading>
                    <Text color={'gray'} fontSize={10}>{description}</Text>
                </VStack>
            </HStack>
            
            <Box onClick={
                ()=>router.push(link || '#')
            } cursor={'pointer'} display={'flex'} borderRadius={50} alignItems={'center'} justifyContent={'center'} width={'50px'} height={'50px'} bg={'#f6f6f6'}>
                <Arrow/>
            </Box>
        </HStack>
        {children}
    </VStack>
  )
}

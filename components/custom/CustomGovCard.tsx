"use client"
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import AvatarCustom from './AvatarCustom'
import Image from 'next/image'
import { useLogicState } from '@/states/useLogicState'

export default function CustomGovCard() {
    const funcionarios = useLogicState((state:any)=>state.getfuncionarios)
    const [funcio_info, setFuncio_info] = useState<any>([]);
    useEffect(()=>{
            async function res(){
                const r = await funcionarios();
                if(r){
                    setFuncio_info(r || [])
                }
            }
            res()
    }, [])
  return (
    <VStack width={'100%'} alignItems={'center'}>
        {funcio_info?.map((item:any, index:any )=>{
            return(

        <HStack key={index} width={'100%'} alignItems={'center'}>
                <AvatarCustom  name={item?.nome || 'Usuário'} image={item?.photo}/>
                <VStack flex={1} gap={0} alignItems={'flex-start'}>
                    <Heading fontWeight={400} lineHeight={1.2} fontSize={12}>{item?.nome}</Heading>
                    <HStack justifyContent={'flex-start'} alignItems={'center'}>
                    <Text lineHeight={1.2} color={'gray'} fontSize={10}>{item?.pais}</Text> 
                    </HStack>
                </VStack>
                <VStack gap={0}>
                    <Heading marginTop={3} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Contactar</Heading>
                    <Box padding={1} display={'flex'} gap={2}>
                        <Image alt='uip' src={'/icons/message-icon.svg'} width={15} height={15}/>
                        <Text fontWeight={400} color={'#747474'} fontSize={10}>Menssagem</Text>
                    </Box>
                </VStack>
            </HStack>

            )
            })}
    </VStack>
    
    
  )
}

"use client"
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState, useTransition } from 'react'
import AvatarCustom from './AvatarCustom';
import Location from '../../public/icons/location-pin.svg'
import Message from '../../public/icons/message.svg'
import { useStreamChatContext } from '@/context/streamChatContext';
import { createChannel } from '@/logic/createChannel';
import { decryptdata } from '@/logic/encryptdata';
import { useRouter } from 'next/navigation';

export default function CustomGovCard() {
    const getfuncionarios = useLogicState((state:any)=>state.getfuncionarios);
    const [funcionarios, setFuncionarios ] = useState<any>(null);
    const {client, pronto} = useStreamChatContext()
    const router = useRouter()
    const t = useTransition()
    useEffect(()=>{
        async function funcionarios_get(){
            const res = await getfuncionarios()
            setFuncionarios(res)
        }
        funcionarios_get()
    }, [])
    async function createchannel(userId:string){
        if(!pronto) return;
        const uip = localStorage.getItem('uip');
        const uipadmin = localStorage.getItem('uipadmin')
        const newuip = uip || uipadmin;
        if(!newuip) return;
        const currentID = await decryptdata(newuip)?.id?.slice(0,5);  
        const other = userId?.slice(0,5)
        console.log(currentID, other)
        const channel = await createChannel(client,currentID,other)
        if(channel){
           router.push('/portal/Mensagens') 
        } 
    }
  return (
    <VStack width={'100%'}>
        {
            funcionarios?.map((item:any, index:any)=>{
                return(
                    <Box gap={2} alignItems={'center'} justifyContent={'flex-start'} width={'100%'} display={'flex'} key={index}>
                        <AvatarCustom image={item?.photo} name={item?.nome}/>
                        <VStack gap={.5} flex={1} alignItems={'start'}>
                            <Heading fontWeight={400} lineHeight={1.2} fontSize={11} 
                            color={'#202020'}>{item?.nome}</Heading>
                            <HStack  alignItems={'center'} gap={1} justifyContent={'start'}>
                              <Location  width={7} height={7}/>
                              <Text lineHeight={1} fontSize={9} color={'gray'}>{item?.pais}</Text>
                            </HStack>
                        </VStack>
                        <VStack>
                            <Button onClick={()=>{createchannel(item?.numero_do_bilhete)}} gap={0} bg={'#f7f7f7'} width={10} height={10} borderRadius={50} padding={0}>
                               <Message  width={20} height={20}/> 
                            </Button>
                            
                        </VStack>
                    </Box>
                )
            })
        }
        
    </VStack>
  )
}

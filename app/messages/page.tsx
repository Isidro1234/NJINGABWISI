"use client"
import LoadingAnim from '@/components/custom/LoadingAnim'
import { useClient } from '@/hook/useClient'
import { decryptdata } from '@/logic/encryptdata'
import { VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChannelList, Chat } from 'stream-chat-react'

export default function Message() {
    const [uip , setuip] = useState<any>([])
    useEffect(()=>{
        const userdata: string = localStorage.getItem('uipadmin') || ''
        const uip: string = localStorage.getItem('uip') || ''
        if(userdata){
            const dc = decryptdata(userdata)
            setuip(dc)
        }else if (uip){
            const dt = decryptdata(uip)
            setuip(dt)
        }
    },[])
    console.log("meu uip", uip)
    const id = `${uip?.id?.slice(0,5)}`
    const {client , pronto} = useClient(uip?.nome , id , uip?.photo || '')
    if(!pronto){
        return <VStack width={'100%'} height={'100%'} bg={'white'}>
            <LoadingAnim/>
            </VStack>
    }
  return (
    <VStack width={'100%'} height={'100%'}>
      <Chat client={client}>
        <ChannelList>

        </ChannelList>
      </Chat>
    </VStack>
  )
}

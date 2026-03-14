"use client"
import LoadingAnim from '@/components/custom/LoadingAnim';
import { useStreamChatContext } from '@/context/streamChatContext'
import { Box, VStack } from '@chakra-ui/react';
import React from 'react'
import { ChannelList, Chat } from 'stream-chat-react'

export default function Mensagem() {
    const {client , pronto} = useStreamChatContext();
    
    if(!pronto){
        return <LoadingAnim/>
    } 
  return (
    <VStack width={'100%'} height={'100%'}>
      <VStack padding={10} borderRadius={20}>
        <Box>
            
        </Box>
        <Chat client={client}>
        <ChannelList>

        </ChannelList>
      </Chat>
      </VStack>
      
    </VStack>
  )
}

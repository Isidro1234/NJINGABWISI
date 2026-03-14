"use client"
import CustomActiveChannel from '@/components/custom/CustomActiveChannel';
import LoadingAnim from '@/components/custom/LoadingAnim';
import { useStreamChatContext } from '@/context/streamChatContext';
import { HStack, VStack } from '@chakra-ui/react';
import React from 'react'
import { Channel, ChannelHeader, ChannelList, Chat, MessageInput, MessageList, Window } from 'stream-chat-react';

export default function Mensagem() {
  const {client , pronto} = useStreamChatContext();
      if(!pronto){
          return <LoadingAnim/>
      } 
    return (
      <HStack width={'100%'} height={'100%'}>
        <Chat  client={client}>
          <ChannelList/>
            <Channel >
               <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
            </Channel>
        </Chat>
      </HStack>
    )
}

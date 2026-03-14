"use client"
import { streamchat_client_frontend } from "@/logic/streamchatregistering";
import { VStack } from "@chakra-ui/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

interface perfect {
    client:any | null,
    pronto:boolean | null
}

const StreamChatContext = createContext<perfect>({
  client:null,
  pronto:false
})

const client = StreamChat.getInstance(`${process.env.NEXT_PUBLIC_STREAM_KEY}`)
export function StreamChatContextProvider({children, userID, image , name}:
    {children:React.ReactNode , userID:string, image:string, name:string}){
    const [client, setClient] = useState<any>(null)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    if (!userID) return

    async function init() {

      const chatClient = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_KEY!
      )

      const token = await streamchat_client_frontend(
        name,
        userID,
        image || "",
        true
      )

      await chatClient.connectUser(
        {
          id: userID,
          name: name,
          image: image
        },
        token
      )

      setClient(chatClient)
      setPronto(true)
    }

    init()

    return () => {
      client?.disconnectUser()
    }
  }, [userID])

    return(
        <VStack width={'100%'}>
          <StreamChatContext.Provider value={{client , pronto}}>
              {children}  
          </StreamChatContext.Provider>
        </VStack>
        
    )
}


export const useStreamChatContext = ():perfect => useContext(StreamChatContext)
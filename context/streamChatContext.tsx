"use client"
import { streamchat_client_frontend } from "@/logic/streamchatregistering";
import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

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
    const [pronto , setPronto] = useState(false);
    useEffect(()=>{
        if(!userID) return;
          async function init(){
            const token = await streamchat_client_frontend(name , userID, image || "", true);
            await client.connectUser({
                username:name,
                id:userID,
                image,
            },
            token
        )
        setPronto(true)
          }
          init()
          return () => {client.disconnectUser()}
    }, [userID])
    return(
        <StreamChatContext.Provider value={{client , pronto}}>
            {children}
        </StreamChatContext.Provider>
    )
}


export const useStreamChatContext = ():perfect => useContext(StreamChatContext)
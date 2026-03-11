import { streamchat_client_frontend } from "@/logic/streamchatregistering";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";



const client =  StreamChat.getInstance(`${process.env.NEXT_PUBLIC_STREAM_KEY}`)

export  function useClient(username:string, id:string, image:string){
    const [pronto, setPronto] = useState(false)
    useEffect(()=>{
        if(!username) return;
        async function init(){
            const token = await streamchat_client_frontend(username, id, image, true)
            await client.connectUser({
                    id,
                    username,
                    image
            },
            token
        )
        setPronto(true)
        }
        init()

        return () => {client.disconnectUser()}
    }, [username])

    return {client , pronto}

}
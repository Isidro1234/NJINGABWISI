import {StreamChat} from 'stream-chat';
import {configDotenv} from 'dotenv'
import { NextResponse } from 'next/server';
configDotenv()
const serverClient = StreamChat.getInstance(
    `${process.env.STREAM_CHAT_KEY}`,
    `${process.env.STREAM_CHAT_SECRECT}`
);


function createToken(id:any){
    const token = serverClient.createToken(id)
    return token
}

export async function POST(request:Request){
    const data = await  request.json();
    const {name, id , image , isregistration} = await data;
    const token = createToken(id);
    if(isregistration){
        const res = await serverClient.upsertUser({
        id,
        name,
        role:"user",
        image
    })
    }
    return NextResponse.json({token})
}
'use client'
import { Box, HStack, Input, QrCode, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useRef } from 'react'
import CustomQrcode from './CustomQrcode'
import { store } from '@/logic/storemedia'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebse'

export default function CustomMeuUIP({userdata}:any) {
    const inputref = useRef<HTMLInputElement>(null);
    const [imagepreview, setImagepreview] = React.useState<string | null>(null);
    async function handleclick(){ 
        inputref.current?.click()
    }
    async function handlePic(fileinput:File){
        const file = fileinput;
        if(!file)return;
        const reader = new FileReader();
        reader.onloadend = (e:any)=> {            
            const base64data : any  = e?.target?.result;
            setImagepreview(base64data)
        }
        reader.readAsDataURL(file);
        try {
           const stored = await store({image:file, name: file.name , type: file.type});
        if(stored){
            setImagepreview(stored)
            const docref = doc(db, 'MeuUIP', userdata.id);
            await updateDoc(docref, {
                photo: stored
            })
            const datas = userdata;
            datas['photo'] = stored;
            localStorage.removeItem('uip');
            localStorage.setItem('uip', JSON.stringify(datas))
        }else{
            console.log('Erro ao atualizar imagem')
        } 
        } catch (error) {
            console.log('Erro ao atualizar imagem', error)
        }
        
    }
  return (
    <HStack gap={4} alignItems={'flex-start'} width={'100%'}>
        <Box borderRadius={20} cursor={'pointer'} onClick={handleclick} flex={1} height={'100px'} position={'relative'}>
            <Input onChange={(e:any)=>{handlePic(e?.target?.files?.[0])}} ref={inputref} type='file' display={'none'} accept='image/*'/>
            <Image fill style={{borderRadius:20, objectFit:'cover', height:'100%', width:'100%'}}
             src={ imagepreview ||  userdata?.photo || '/icons/avatar.svg'} alt='avatar'/>
        </Box>
        <VStack alignItems={'flex-start'} flex={1}>
            <Text color={'gray.500'} fontSize={10}>{userdata?.nome}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.moradia}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.estado}</Text>
            <Text color={'gray.500'} fontSize={10}>{userdata?.shortuip_id}</Text>
        </VStack>
        <Box >
           <CustomQrcode value={`https://n-jinga.vercel.app/verifyuip/${userdata?.id}` || 'N/A'}/>
        </Box>
    </HStack>
  )
}

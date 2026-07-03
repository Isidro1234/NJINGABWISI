'use client'
import { Box, HStack, Input, QrCode, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import CustomQrcode from './CustomQrcode'
import { store } from '@/logic/storemedia'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebse'
import { useLogicState } from '@/states/useLogicState'
import { useStateAuth } from '@/states/useAuthState'

export default function CustomMeuUIP({userdata}:any) {
    const inputref = useRef<HTMLInputElement>(null);
    const [imagepreview, setImagepreview] = React.useState<string | null>(null);
    const uip_info = useStateAuth((state:any)=>state.MyUIP)
    const myuipget = useStateAuth((state:any)=>state.myuipget)
    const updateMyUIP = useLogicState((state:any)=>state.update_uip_profile)
    const [uip , setuip] = useState<any>(null)
    useEffect(()=>{
        async function fetchUIP(){
            const data = await myuipget()
            setuip(data)
        }
        fetchUIP()
    }, [])
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
            await updateMyUIP(uip_info?.data?.account_id, uip_info?.data?.uip, {photo: stored})
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
             src={  imagepreview ||  uip_info?.data?.photo || '/icons/avatar.svg'} alt='avatar'/>
        </Box>
        <VStack alignItems={'flex-start'} flex={1}>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.full_name}</Text>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.moradia}</Text>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.job}</Text>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.short_uip}</Text>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.accountType}</Text>
            <Text color={'gray.500'} fontSize={10}>{uip_info?.data?.nacionalidade}</Text>
        </VStack>
        <Box >
           <CustomQrcode size={null} value={`${uip_info?.data?.short_uip}` || 'N/A'}/>
        </Box>
    </HStack>
  )
}

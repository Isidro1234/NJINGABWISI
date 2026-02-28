"use client"
import InputLabel from '@/components/custom/InputLabel';
import { auth, db } from '@/config/firebse';
import { store } from '@/logic/storemedia';
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import React, { useRef } from 'react'

export default function Perfil() {
    const sair = useStateAuth((state:any)=>state.logout);
    const inputref = useRef<HTMLInputElement>(null)
    const [imagepreview, setImagepreview] = React.useState<string | null>(null);
    async function handlePic(fileinput:File){
        const file = fileinput
        if(!file)return;
        const reader = new FileReader();
        reader.onloadend = (e:any)=> {            
            const base64data : any  = e?.target?.result;
            setImagepreview(base64data)
        }
        reader.readAsDataURL(file);
        const name = file.name;
        const stored = await store({image:file, name: name , type: file.type});
        if(stored){
            try {
              await updateProfile(auth.currentUser!, {
                photoURL: stored
            })
            const docref = doc(db, 'Perfil', auth.currentUser!.uid);
            await updateDoc(docref, {
                userPhoto: stored
            })
            } catch (error:any) {
                console.log('Erro ao atualizar imagem no perfil:', error);
            }
            
        }else{
            console.log('Erro ao atualizar imagem')
        }
    }
    function handleclick(){
        if(!inputref.current)return;
        inputref?.current.click()
    }
  return (
    <VStack padding={10} width={'100%'} height={'100%'} bg={'#f6f6f6'}>
        <VStack alignItems={'flex-start'} bg={'white'} padding={10} borderRadius={20}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                        <Box position={'relative'} borderRadius={50} width={75} height={75} bg={'#f6f6f6'}>
                            <Image fill style={{borderRadius:50, objectFit:'cover', height:'100%', width:'100%'}} alt='avatar' 
                            src={ imagepreview || auth.currentUser?.photoURL || '/icons/avatar.svg'} />
                            <Input onChange={(e:any)=>{handlePic(e.target.files[0])}} ref={inputref} type='file' display={'none'} accept='image/*'/>
                            <Box cursor={'pointer'} onClick={handleclick} position={'absolute'} bottom={0} right={0} width={25} height={25} borderRadius={50} bg={'#ffffff'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <Image alt='edit' src={'/icons/camera.svg'} width={20} height={20}/>
                            </Box>
                        </Box>
                        <Text fontSize={12} color={'gray'}>@{auth.currentUser?.displayName}</Text>
                        
            </Box>
            <InputLabel label='Profissao' type='text' onchange={(e:any)=>{console.log(e)}} placeholder='Profissao'/>
            <VStack alignItems={'flex-start'}>
                <Text fontSize={12} color={'gray'}>Quer ser agente Imobiliario?</Text>
               <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'} bg={'transparent'} fontWeight={400} color='gray' onClick={sair}>
                aplicar</Button> 
            </VStack>
            
            <Button borderRadius={50} borderWidth={1} borderColor={'#eaeaea'} bg={'transparent'} color='red' onClick={sair}>Sair</Button>
        </VStack>
        
    </VStack>
  )
}

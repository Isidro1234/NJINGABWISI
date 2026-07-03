import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'
import CustomUIPElement from './CustomUIPElement'
import Image from 'next/image'
import { useLogicState } from '@/states/useLogicState'
import { toaster, Toaster } from '../ui/toaster'

export default function CustomUipCard() {
     const [uipnumber, setUipNumber] = useState('')
     const getqrcodedata = useLogicState((state:any)=>state.queryUserUIP)
     const [userdata, setUserdata] = useState<any>(null)
     const [loading, setLoading] = useState(false)  
     async function handleClick(){
        if(!uipnumber){
            return toaster.create({
                title:"Por favor insira um número UIP para pesquisa",
                description:"O campo de número UIP não pode estar vazio. Por favor, insira um número válido para realizar a pesquisa.",
                duration:5000,
                type:"warning"
            })
        }
        setLoading(true)
        const data = await getqrcodedata(uipnumber)   
        setUserdata(data.data)
        setLoading(false)
    }
   console.log(userdata)
  return (
    <VStack width={'100%'} marginTop={-2} alignItems={'flex-start'}>
      
         <CustomUIPElement isloading={loading} onclick={handleClick} onchange={(e:any)=>{setUipNumber(e)}}  showselect={false}/>
           <Toaster/>
           {(!userdata?.full_name && uipnumber) && <Text fontSize={14} fontWeight={300} color={'gray'}>Resultados para "{uipnumber}"</Text>}
         <VStack alignItems={'flex-start'} width={'100%'} display={!userdata?.full_name ? "none" : 'flex'}>
         {userdata?.full_name ?
         <>
          <Text fontSize={14} fontWeight={300} color={'gray'}>Encontrado "{userdata?.full_name || "Não encontrado"}"</Text>
         <HStack width={'100%'} alignItems={'center'}>
                    <AvatarCustom  name={userdata?.full_name || 'Usuário'} image={userdata?.photo || ''}/>
                    <VStack flex={1} gap={0} alignItems={'flex-start'}>
                        <Heading color={'gray'} fontWeight={400} lineHeight={1.2} fontSize={14}>{userdata?.full_name?.slice(0,10) + "..." || "Não encontrado"}</Heading>
                        <HStack justifyContent={'flex-start'} alignItems={'center'}>
                        <Text lineHeight={1.2} color={'gray'} fontSize={10}>{userdata?.job || "Não encontrado"}</Text> 
                        </HStack>
                    </VStack>
                    <VStack gap={1}>
                        <Heading marginTop={2} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Estado</Heading>
                        <Box borderRadius={50} padding={"2px 8px"} bg={'#3DDA69'}>
                            <Text fontWeight={300} color={'#ffffff'} fontSize={10}>{userdata?.status || "Não encontrado"}</Text>
                        </Box>
                    </VStack>
                    <VStack gap={1}>
                        <Heading marginTop={2} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Numero UIP</Heading>
                        <Box alignItems={'center'} gap={1} display={'flex'} borderRadius={50} padding={"2px 8px"} bg={'#FBFBFB'}>
                            <Image alt='uip' src={'/icons/idnumber.svg'} width={15} height={15}/>
                            <Text fontWeight={500} color={'#0098C2'} fontSize={10}>{userdata?.short_uip || "Não encontrado"}</Text>
                        </Box>
                    </VStack>

                </HStack>
                </>
                : 
                <Text fontSize={14} fontWeight={300} color={'gray'}>Nenhum resultado encontrado para "{uipnumber}"</Text>
                }
            </VStack>
   
    </VStack>
   
  )
}

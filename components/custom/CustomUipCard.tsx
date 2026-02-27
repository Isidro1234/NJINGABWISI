import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'
import CustomUIPElement from './CustomUIPElement'
import Image from 'next/image'
import { useLogicState } from '@/states/useLogicState'

export default function CustomUipCard() {
     const [uipnumber, setUipNumber] = useState('')
     const getqrcodedata = useLogicState((state:any)=>state.getUIPprofile)
     const [userdata, setUserdata] = useState<any>(null)
     async function handleClick(){
        const data = await getqrcodedata(uipnumber)   
        setUserdata(data)
    }
  return (
    <VStack width={'100%'} marginTop={-2} alignItems={'flex-start'}>
         <CustomUIPElement onclick={handleClick} onchange={(e:any)=>{setUipNumber(e)}}  showselect={false}/>
         
         <VStack alignItems={'flex-start'} width={'100%'} display={!userdata ? "none" : 'flex'}>
          <Text fontSize={14} fontWeight={300} color={'gray'}>Encontrado "{userdata?.nome || "Não encontrado"}"</Text>
         <HStack width={'100%'} alignItems={'center'}>
        <AvatarCustom  name={auth.currentUser?.displayName || 'Usuário'} image={''}/>
        <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading color={'gray'} fontWeight={400} lineHeight={1.2} fontSize={14}>{userdata?.nome.slice(0,10) + "..." || "Não encontrado"}</Heading>
            <HStack justifyContent={'flex-start'} alignItems={'center'}>
               <Text lineHeight={1.2} color={'gray'} fontSize={10}>{userdata?.profissao || "Não encontrado"}</Text> 
            </HStack>
        </VStack>
        <VStack gap={1}>
            <Heading marginTop={2} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Estado</Heading>
            <Box borderRadius={50} padding={"2px 8px"} bg={'#3DDA69'}>
                <Text fontWeight={300} color={'#ffffff'} fontSize={10}>{userdata?.estado || "Não encontrado"}</Text>
            </Box>
        </VStack>
        <VStack gap={1}>
            <Heading marginTop={2} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Numero UIP</Heading>
            <Box alignItems={'center'} gap={1} display={'flex'} borderRadius={50} padding={"2px 8px"} bg={'#FBFBFB'}>
                <Image alt='uip' src={'/icons/idnumber.svg'} width={15} height={15}/>
                <Text fontWeight={500} color={'#0098C2'} fontSize={10}>{userdata?.shortuip_id || "Não encontrado"}</Text>
            </Box>
        </VStack>
    </HStack>
    </VStack>
    </VStack>
   
  )
}

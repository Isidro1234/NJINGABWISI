"use client"
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import SelectCustomValue from './SelectCustomValue'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CustomHouseAdmin({name, location, identificacao, image ,id , destination}:
    {name:string, location:string, identificacao:Array<any>, image:string, id:string , destination:string}) {
        const router = useRouter()
  return (
    <HStack borderWidth={1} borderRadius={10} bg={'#FAFAFA'} padding={5} marginTop={4} width={'100%'} alignItems={'start'}>
        <AvatarCustom image={image} name={name}/>
        <VStack justifyContent={'center'} gap={0} alignItems={'flex-start'} flex={1}>
            <Text color={'gray'}  marginTop={1.5} lineHeight={1.2} fontSize={12}>{name || ''}</Text>
            <Text lineHeight={1.2} fontSize={10} color={'gray'}>{location || ""}</Text>
        </VStack>
        <VStack alignItems={'end'}>
            <Text fontSize={10} color={'gray'}>Estado do Processo</Text>
            <HStack>
                <Box onClick={()=>{router.push(`/admin/portaladministrador/documentos/${id}?tipo=${destination}`)}} position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#34FFA4'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/file-t.svg'} 
                   fill/>
                </Box>
                <SelectCustomValue  width='100px' setChange={(e:any)=>{console.log(e)}} 
                borderRadius={50} items={[{label:'aprovado', value:'aprovado'},
                    {label:'incompleto', value:'incompleto'},
                    {label:'negado', value:'negado'}
                ]}/>
            </HStack>
            <HStack>
                <Box position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#34FFA4'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/aceitar.svg'} 
                   fill/>
                </Box>
                <Box position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#FFBB34'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/incompleto.svg'} fill/>
                </Box>
                <Box position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#FF3434'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/negar.svg'} fill/>
                </Box>
            </HStack>
        </VStack>
    </HStack>
  )
}

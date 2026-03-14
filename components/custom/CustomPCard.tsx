import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import Location from '../../public/icons/location-pin.svg'
import { auth } from '@/config/firebse'

export default function CustomPCard({image, name , location , estado}:{image:string,name:string, location:string,estado:string}) {
  return (
    <HStack width={'100%'} alignItems={'center'}>
        <AvatarCustom  name={auth.currentUser?.displayName || 'Usuário'} image={image}/>
        <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading fontWeight={400} lineHeight={1.2} fontSize={12}>{name}</Heading>
            <HStack gap={1} justifyContent={'flex-start'} alignItems={'center'}>
                <Location width={8} height={8}/>
               <Text marginTop={'2px'} lineHeight={1.2} color={'gray'} fontSize={10}>{location}</Text> 
            </HStack>
        </VStack>
        <VStack gap={0}>
            <Heading marginTop={3} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Estado do Processo</Heading>
            <Box padding={'5px 8px'} bg={estado== "revisao" ? '#f19408' : (estado == "incompleto") ? "red" : "green"} borderRadius={20}>
                <Text fontWeight={300} color={'white'} fontSize={10}>{estado}</Text>
            </Box>
        </VStack>
    </HStack>
  )
}

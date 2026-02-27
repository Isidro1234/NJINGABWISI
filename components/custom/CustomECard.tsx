import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import AvatarCustom from './AvatarCustom'
import { auth } from '@/config/firebse'

export default function CustomECard() {
  return (
    <HStack width={'100%'} alignItems={'center'}>
        <AvatarCustom  name={auth.currentUser?.displayName || 'Usuário'} image={''}/>
        <VStack flex={1} gap={0} alignItems={'flex-start'}>
            <Heading fontWeight={400} lineHeight={1.2} fontSize={15}>Pessoa</Heading>
            <HStack justifyContent={'flex-start'} alignItems={'center'}>
               <Text lineHeight={1.2} color={'gray'} fontSize={10}>banco</Text> 
            </HStack>
        </VStack>
        <VStack gap={0}>
            <Heading marginTop={3} fontWeight={300} lineHeight={1.4} fontSize={10} color={'gray'}>Pagamento a debito</Heading>
            <Box padding={1}>
                <Text fontWeight={500} color={'#0098C2'} fontSize={13}>$10000</Text>
            </Box>
        </VStack>
    </HStack>
  )
}

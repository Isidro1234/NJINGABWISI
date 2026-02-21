import { Box, Button, Heading, Input, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Entrar() {
  return (
    <VStack padding={10} h={'100%'} width={'100%'} bg={'#d33434'}>
        <VStack borderRadius={20} padding={10} bg={'white'}>
          <Heading>Entrar</Heading>
          <Input placeholder='Id, numero do bilhete ou passaporte'/>
          <Input placeholder='senha'/>
          <Input placeholder='codigo de seguranca'/>
          <Button width={'100%'}>Entrar</Button>
        </VStack>
    </VStack>
  )
}

import Footer from '@/components/structures/Footer'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

import Facebook from '../../public/icons/facebook.svg'
import Gmail from '../../public/icons/gmail.svg'
import Instagram from '../../public/icons/instagram.svg'
import Whatsapp from '../../public/icons/whatsapp.svg'
export default function Quemsomos() {
  return (
    <HStack position={'relative'} gap={0} height={'100%'} flexWrap={'wrap'}>
      <Box flex={1} minHeight={200} minWidth={200} position={'relative'} height={'100%'}>
        <Image fill style={{objectFit:'cover', width:'100%', height:'100%'}} src={'/images/image-1.jpg'} alt='image' />
      </Box>
      
      <VStack  position={'absolute'} minWidth={10} bg={'#490c0c'} padding={5} alignItems={'flex-start'} height={300} 
       maxWidth={300} width={'100%'}>
          <Heading fontSize={25} color={'white'}>NJINGA</Heading>
          <Text fontSize={12} color={'white'}>
            Somos uma plataforma de registo e pagamento de imposto criado pela
            INTA (industria nacional de technologia avancada) com o objectivo de ajudar o governo
            Angolano faciltar o registo imoveis e o facil pagamento de impostos. A INTA cujo os
            Fundadores sao: Isidoro Zau e Afonso Teba.
          </Text>
      </VStack>
      <Footer/>
    </HStack>
  )
}

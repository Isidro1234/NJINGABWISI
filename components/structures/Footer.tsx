'use client'
import { Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname  } from 'next/navigation'

import Facebook from '../../public/icons/facebook.svg'
import Gmail from '../../public/icons/gmail.svg'
import Instagram from '../../public/icons/instagram.svg'
import Whatsapp from '../../public/icons/whatsapp.svg'



export default  function Footer() {
    const pathname = usePathname()
  return (
    <VStack   width={"100%"}  alignItems={"flex-start"} padding={"24px 40px"}  borderTopWidth={1} backgroundColor={"#1f1f1fff"}>
        <HStack gap={15} alignItems={"start"}   display={"grid"} gridTemplateColumns={"repeat(auto-fit,minmax(100px, 1fr))"} width={"100%"} justifyContent={"space-between"} alignContent={"center"}>
            <VStack  alignItems={"flex-start"}>
                <Heading fontSize={20} color={"white"}>Contactos</Heading>
                <a href="mailto:info@bwisi.tech"><Text fontSize={12} color={"#CECECE"}>info@bwisi.tech</Text></a>
                <a href="mailto:info@bwisi.tech"><Text fontSize={12} color={"#CECECE"}>+244 934590992</Text></a>
                <HStack gap={2} marginTop={2} flexWrap={'wrap'}>
                      <Button  margin={0} padding={0} width={10} height={10} borderRadius={50}><Facebook width={'20px'} height={'20px'}/></Button>
                      <Button  margin={0} padding={0} width={10} height={10} borderRadius={50}><Instagram width={40} height={40}/></Button>
                      <Button margin={0} padding={0} width={10} height={10} borderRadius={50}><Whatsapp width={40} height={40}/></Button>
                      <Button  margin={0} padding={0} width={10} height={10} borderRadius={50}><Gmail width={40} height={40}/></Button>
                    </HStack>
            </VStack>
            <VStack alignItems={"flex-start"}>
                <Heading color={"white"} fontSize={20}>
                    Termos & Condições
                </Heading>
                <VStack alignItems={"flex-start"} gap={1}>
                    <Link className='link-terms' href={"/privacidade"}  color='#CECECE'>Termos de privacidade</Link>
                    <Link className='link-terms' href={"/dados"}  color='#CECECE'>Termos de proteção de dados</Link>
                    <Link className='link-terms' href={"/Sobre-nos"}  color='#CECECE'>Saiba mais sobre nos</Link>
                </VStack>
             </VStack>   
             <VStack alignItems={"flex-start"}>
                <Heading color={"white"} fontSize={20}>
                    Serviços
                </Heading>
                <VStack alignItems={"flex-start"} gap={1}>
                    <Stack direction={"row"} alignItems={"center"}>
                        
                        <Link className='link-terms' href={"/Plataformas"}  color='#CECECE'>PIU/UIP</Link>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                     
                     <Link className='link-terms' href={"/Plataformas"}  color='#CECECE'>Impostos</Link>   
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                     
                      <Link className='link-terms' href={"/Plataformas"}  color='#CECECE'>Registo</Link>  
                    </Stack>
                    
                </VStack>
             </VStack>   
        </HStack>
        <hr style={{color:"gray"}}/>
        <Text fontSize={10} textAlign={"center"} color={"#CECECE"}>© {new Date().getFullYear()} Bwisi. Todos os direitos reservados.</Text>
        <Text fontSize={10} color={'#CECECE'}></Text>

    </VStack>
  )
}

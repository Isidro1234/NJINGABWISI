'use client'
import { Button, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname  } from 'next/navigation'




export default  function Footer() {
    const pathname = usePathname()
  return (
    <VStack   width={"100%"}  alignItems={"flex-start"} padding={"24px 40px"}  borderTopWidth={1} backgroundColor={"#1f1f1fff"}>
        <HStack gap={15} alignItems={"start"}   display={"grid"} gridTemplateColumns={"repeat(auto-fit,minmax(100px, 1fr))"} width={"100%"} justifyContent={"space-between"} alignContent={"center"}>
            <VStack  alignItems={"flex-start"}>
                <Heading fontSize={20} color={"white"}>Contactos</Heading>
                <a href="mailto:info@bwisi.tech"><Text fontSize={12} color={"#CECECE"}>info@bwisi.tech</Text></a>
                <a href="mailto:info@bwisi.tech"><Text fontSize={12} color={"#CECECE"}>+244 934590992</Text></a>
                <HStack gap={2} justifyContent={"flex-start"}>
                    <a  href="https://youtube.com/@bwisi-answer1?si=xC-HvOan9iBHFWw0" 
                    style={{padding:5, background:"white", borderRadius:50, height:"fit-content"}}>
                       
                    </a>
                    <a href="https://www.instagram.com/bwisi_corporation/" 
                    style={{padding:5, background:"white", borderRadius:50,height:"fit-content"}}>
                      
                    </a>
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

"use client"
import { auth } from '@/config/firebse'
import { decryptdata } from '@/logic/encryptdata';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import CustomQrcode from './CustomQrcode';

export default function UIPprint({ref}:{ref:any}) {
    const [decrypt, setDecrypt] = useState<any>(null)

    useEffect(() => {
        const uip = localStorage?.getItem('uip') || ''
        const decrypted = uip ? decryptdata(uip) : null
        setDecrypt(decrypted)
    }, [])

    if (!decrypt) return null
  return (
    <VStack className='uipstyle' gap={5} ref={ref} bg={'white'} width={'100%'} padding={10}>
         <VStack className='uipstyle' width={'100%'}>
                    <Image 
                     width={40} height={40} src={'/icons/angola.svg'} alt='logo-angola'/>
                    <Box className='uipstyle' minW={10} width={'100%'}  maxWidth={500} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                        <Text textAlign={'center'} fontWeight={500} width={'250px'} fontSize={10} color={'black'}>Governo de Angola</Text>
                        <Text textAlign={'center'} fontWeight={500} width={'250px'} fontSize={10} color={'black'}>Ministério das Finanças</Text>
                        <Text textAlign={'center'} fontWeight={500} width={'300px'} fontSize={10} color={'black'}>Perfil de Identificação Universal (PIU)</Text>
                    </Box>

        </VStack>
        <HStack className='uipstyle' borderStyle={'dashed'} borderWidth={1.5} alignItems={'flex-start'} gap={5} padding={4} borderRadius={10} bg={'#ffffff'}>
            <Box className='uipstyle' padding={2} borderRadius={10} position={'relative'} width={150} height={150}>
              <Image  fill style={{objectFit:"cover",borderRadius:10, height:'100%', width:'100%'}} src={decrypt?.photo}  alt='imge'/>  
            </Box>
            <Box className='uipstyle' flex={1}>
                <HStack className='uipstyle'  gap={1} width={'100%'} alignItems={'center'} justifyContent={'end'}>
                    <HStack className='uipstyle' alignItems={'center'}>

                     <Box className='uipstyle' position={'relative'} width={5} height={5}>
                        <Image alt='' style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:50}} fill 
                        src={'/icons/angola-flag.svg'}/>
                    </Box>
                    <Box className='uipstyle'>
                       <Heading color={'gray'} marginTop={-3} fontWeight={400} fontSize={10}>Angola</Heading> 
                    </Box>
                    </HStack>
                </HStack>
                <HStack className='uipstyle' flex={1} marginTop={2}>
                        <Box>
                            <Image width={20} height={20}  alt='uip' src={'/icons/uip.svg'}/>
                        </Box> 
                        <Heading fontWeight={400} marginTop={-3.5} color={'gray'} fontSize={14}>Cartão UIP/PIU</Heading>
                    </HStack>
                <HStack className='uipstyle' marginTop={2} gap={4} justifyContent={'flex-start'}>
                    <Box className='uipstyle'>
                        <Text color={'gray'} fontSize={10}>Nome:</Text>
                        <Text color={'gray'} fontSize={10}>Estado:</Text>
                        <Text fontSize={10} color={'gray'}>UIP:</Text>
                        <Text color={'gray'} fontSize={10} >Identificação:</Text> 
                        <Text color={'gray'} fontSize={10} >Profissão:</Text>
                    </Box>
                    <Box className='uipstyle'>
                        <Text color={'gray'} fontSize={10}>{decrypt?.nome || ''}</Text>
                        <Text color={'green.500'} fontSize={10}>{decrypt?.estado || ''}</Text>
                        <Text fontSize={10} color={'green.500'}>{decrypt?.shortuip_id || ''}</Text>
                        <Text color={'gray'} fontSize={10} >{decrypt?.tipoIdentificacao || ''}</Text> 
                        <Text color={'gray'} fontSize={10}>{decrypt?.profissao || ''}</Text> 
                    </Box>
                </HStack>
                <Box className='uipstyle' paddingTop={4} width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Box className='uipstyle' alignSelf={'flex-end'}>
                       <CustomQrcode size={5}  value={`https://n-jinga.vercel.app/verifyuip/${decrypt?.id}` || 'N/A'}/>  
                    </Box>
                    
                </Box>
                
            </Box>
               
        </HStack>
    </VStack>
  )
}

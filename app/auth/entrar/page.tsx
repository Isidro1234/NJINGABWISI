'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Entrar() {
  const [Id, setId] = useState()
  return (
    <VStack justifyContent={'center'} padding={10} h={'100%'} width={'100%'} bg={'#d33434'}>
        <VStack flexWrap={'wrap'}  borderRadius={20} padding={10} gap={2} bg={'white'}>
          <VStack gap={0} marginTop={-10} marginLeft={-5}>
            <Logo/>
            <Heading marginTop={-4}>Entrar</Heading>
          </VStack>
          <HStack alignSelf={'flex-start'} justifyContent={'flex-start'} alignItems={'center'}>
            <InputLabel type='number' onchange={(e:any)=>setId(e)} label='Identificacao' 
          placeholder='Id, numero do bilhete ou passaporte'/>
             <Box marginTop={5}>
                <SelectCustomValue borderRadius={2} width='170px' items={[{label:'Passaporte', value:'passport'},{label:'Bilhete', value:'bilhete'}]}/>          
             </Box>
            
          </HStack>
          <InputLabel type='password' onchange={(e:any)=>setId(e)} label='Senha' 
          placeholder='digite sua senha'/>
          <InputLabel type='number' onchange={(e:any)=>setId(e)} label='Codigo de seguranca ' 
          placeholder='digite seu codigo'/>
          <Button bg={'#d33434'} width={'100%'}>criar conta</Button>
          <Link href={'/auth/criarconta'}><Text fontSize={10} color={'gray'}>Ainda nao tem conta na NJINGA? clique <span style={{color:'red'}}>aqui</span></Text> </Link>
        </VStack>
    </VStack>
  )
}

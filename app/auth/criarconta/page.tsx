'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Criarconta() {
  const [Id, setId] = useState()
  return (
    <VStack justifyContent={'center'} padding={10} h={'100%'} width={'100%'} bg={'#d33434'}>
        <VStack flexWrap={'wrap'}  borderRadius={20} padding={10} gap={2} bg={'white'}>
          <VStack gap={0} marginTop={-10} marginLeft={-5}>
            <Logo/>
            <Heading marginTop={-4}>Criar conta</Heading>
          </VStack>
          <HStack justifyContent={'flex-start'}>
            <InputLabel type='name' onchange={(e:any)=>setId(e)} label='Nome completo' 
          placeholder='digite seu nome completo'/>
          <InputLabel type='email' onchange={(e:any)=>setId(e)} label='Email' 
          placeholder='digite email'/>
          </HStack>
          <HStack alignSelf={'flex-start'} justifyContent={'flex-start'} alignItems={'center'}>
            <InputLabel type='number' onchange={(e:any)=>setId(e)} label='Identificacao' 
          placeholder='Id, numero do bilhete ou passaporte'/>
             <Box marginTop={5}>
                <SelectCustomValue borderRadius={2} width='170px' items={[{label:'Passaporte', value:'passport'},{label:'Bilhete', value:'bilhete'},
                   {label:'NIF', value:'NIF'}
                ]}/>          
             </Box>
            
          </HStack>
          <InputLabel type='password' onchange={(e:any)=>setId(e)} label='Senha' 
          placeholder='digite sua senha'/>
          <InputLabel type='password' onchange={(e:any)=>setId(e)} label='Confirmar Senha' 
          placeholder='digite sua senha'/>
          <InputLabel type='phone' onchange={(e:any)=>setId(e)} label='Numero de Telefone' 
          placeholder='digite seu numero de telefone'/>
          <Button bg={'#d33434'} width={'100%'}>Criar conta</Button>
          <Link href={'/auth/entrar'}><Text fontSize={10} color={'gray'}>Ja tem conta na NJINGA clique <span style={{color:'red'}}>aqui</span></Text> </Link>
        </VStack>
    </VStack>
  )
}

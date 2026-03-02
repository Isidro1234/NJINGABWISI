"use client"
import InputLabel from '@/components/custom/InputLabel'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Entrar() {
  return (
    <VStack padding={10}>
        <VStack alignItems={'flex-start'} borderRadius={20} bg={'white'} padding={10}>

            <Heading>Entrar</Heading>
            <Text fontSize={12} color={'gray'}>bem-vindo a Njinga Admin</Text>
            <InputLabel label='Identificacao' onchange={(e:any)=>console.log(e)}
             placeholder='digite seu numero de bilhete' type='text'/>
            <Text fontSize={12} color={'gray'}>bem-vindo a Njinga Admin</Text>
            <SelectCustomValue borderRadius={0} setChange={(e:any)=>{console.log(e)}} width='100%' items={[{value:'colaborador', label:'Colaborador'},
                {value:'administrador', label:'Administrador'}
            ]}/>
            <Button width={'100%'} bg={'#d33434'}>Entrar</Button>
        </VStack>
    </VStack>
  )
}

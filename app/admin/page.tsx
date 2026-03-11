"use client"
import InputLabel from '@/components/custom/InputLabel'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Toaster, toaster } from '@/components/ui/toaster'
import { useStateAuth } from '@/states/useAuthState'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function Entrar() {
   const [form, setForm] = useState(()=>({
      identificacao:null,
      codigo_de_entrada:null,
      senha:null
   }))
   const login = useStateAuth((state:any)=>state?.loginAdmin)
   async function entrar(){
      if(!form.codigo_de_entrada || !form.identificacao || !form.senha){
         toaster.create({
            title:"Porfavor preencha todas as lacunas",
            duration:5000,
            type:"error"
         })
         return
      }
     const res = await login(form.identificacao , form.senha ,  form.codigo_de_entrada)

   }
  return (
    <VStack padding={10}>
        <VStack alignItems={'flex-start'} borderRadius={20} bg={'white'} padding={10}>
            <VStack gap={1} width={'100%'}>
                <Text   fontSize={35} lineHeight={.9} fontWeight={700}><span className='logo-text-1'>N</span><span className='logo-text-2'>J</span>
                               <span className='logo-text-3'>I</span>NGA</Text>
               <Text fontSize={12} color={'gray'}>Bem-vindo a Njinga Admin</Text>
            </VStack>
            <Text width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>Porfavor acesse sua conta entrando seus dados a baixo</Text>
            
            <InputLabel label='Identificacao' onchange={(e:any)=>setForm((p)=>({...p, identificacao:e}))}
             placeholder='digite seu numero de bilhete' type='text'/>
              <InputLabel label='Senha' onchange={(e:any)=>setForm((p)=>({...p, senha:e}))}
             placeholder='digite sua senha' type='text'/>
            <HStack alignItems={'start'}>
               <InputLabel label='Codigo de entrada' onchange={(e:any)=>setForm((p)=>({...p, codigo_de_entrada:e}))}
             placeholder='digite seu codigo de entrada' type='text'/>
             <Button bg={'#d33434'} marginTop={"22px"}>Receber Codigo</Button>
            </HStack>
            
            <Button onClick={entrar} width={'100%'} bg={'#d33434'}>Entrar</Button>
        </VStack>
        <Toaster/>
    </VStack>
  )
}

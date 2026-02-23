'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { useAuthContext } from '@/context/authContext'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Entrar() {
  const [Id, setId] = useState()
  const [Identificacao, setIdentificacao] = useState('')
  const [tipoIdentificacao, setTipoIdentificacao] = useState('')
  const [password, setPassword] = useState('');
  const enviardados = useStateAuth((state:any)=>state.login)
  const {setUserLogged, setUserdata, setLoading,} :any  = useAuthContext()
  const router = useRouter()
  async function submeter(){
    if(!Identificacao || !password || !tipoIdentificacao) {
      alert('this is an error')
    }
    const res = await enviardados(Identificacao, tipoIdentificacao, password)
    if(res){
      setLoading(true)
      router.push('/auth/codigo')
    }
  }
  return (
    <VStack justifyContent={'center'} padding={10} h={'100%'} width={'100%'} bg={'#d33434'}>
        <VStack flexWrap={'wrap'}  borderRadius={20} padding={10} gap={2} bg={'white'}>
          <VStack gap={0} marginTop={-10} marginLeft={-5}>
            <Logo/>
            <Heading marginTop={-4}>Entrar</Heading>
          </VStack>
          <HStack alignSelf={'flex-start'} justifyContent={'flex-start'} alignItems={'center'}>
            <InputLabel type='text' onchange={(e:any)=>setIdentificacao(e)} label='Identificacao' 
          placeholder='Id, numero do bilhete ou passaporte'/>
             <Box marginTop={5}>
                <SelectCustomValue setChange={(e:any)=>{setTipoIdentificacao(e)}} borderRadius={2} width='170px' items={[{label:'Passaporte', value:'passport'},{label:'Bilhete', value:'bilhete'}]}/>          
             </Box>
            
          </HStack>
          <InputLabel type='password' onchange={(e:any)=>setPassword(e)} label='Senha' 
          placeholder='digite sua senha'/>
          <Button onClick={submeter} bg={'#d33434'} width={'100%'}>Entrar</Button>
          <Link href={'/auth/criarconta'}><Text fontSize={10} color={'gray'}>Ainda nao tem conta na NJINGA? clique <span style={{color:'red'}}>aqui</span></Text> </Link>
        </VStack>
    </VStack>
  )
}

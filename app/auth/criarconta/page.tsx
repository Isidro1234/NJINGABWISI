'use client'
import InputLabel from '@/components/custom/InputLabel'
import Logo from '@/components/custom/Logo'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { auth } from '@/config/firebse'
import { useAuthContext } from '@/context/authContext'
import { useStateAuth } from '@/states/useAuthState'
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Criarconta() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [Phonenumber, setPhoneNumber] = useState('')
  const [Identificacao, setIdentificacao] = useState('')
  const [tipoIdentificacao, setTipoIdentificacao] = useState('')
  const [password, setPassword] = useState('');
  const [profissao, setProfissao] = useState('')
  const [profissaoOutro, setProfissaoOutro] = useState('')
  const [moradia, setMoradia] = useState('')
  const [confirmPassword, setCorfimPassworf] = useState('');
  const enviardados = useStateAuth((state:any)=>state.createAccount)
  const {setUserLogged, setUserdata, setLoading,} :any  = useAuthContext()
  const router = useRouter()
  async function submeter(){
     setLoading(true)
     if(profissao === 'outro' && profissaoOutro){
        setProfissao(profissaoOutro)
     }
     if(!nome || !email || !Phonenumber || !Identificacao || !tipoIdentificacao || !password ||
       !confirmPassword || !moradia || !profissao) {
        alert('fill all the blanks')
        return;
      }
      if(password !== confirmPassword){
        alert('password does not mutch confirm password')
        return;
      }
      const res = await enviardados(nome, Identificacao, tipoIdentificacao, Phonenumber, email, password, moradia, profissao);
      if(res){
        setLoading(false)
        setUserdata(auth.currentUser?.displayName)
        setUserLogged(true)
        router.push('/portal')
      }
  }
  return (
    <VStack justifyContent={'center'} padding={10}  width={'100%'} bg={'#d33434'}>
        <VStack flexWrap={'wrap'}  borderRadius={20} padding={10} gap={2} bg={'white'}>
          <VStack gap={0} marginTop={-10} marginLeft={-5}>
            <Logo/>
            <Heading marginTop={-4}>Criar conta</Heading>
          </VStack>
          <HStack justifyContent={'flex-start'}>
            <InputLabel type='name' onchange={(e:any)=>setNome(e)} label='Nome completo' 
          placeholder='digite seu nome completo'/>
          <InputLabel type='email' onchange={(e:any)=>setEmail(e)} label='Email' 
          placeholder='digite email'/>
          </HStack>
          <InputLabel type='location' onchange={(e:any)=>setMoradia(e)} label='Onde voce mora?' 
          placeholder='digite sua moradia'/>
          <HStack gap={1} width={'100%'} alignSelf={'flex-start'} justifyContent={'flex-start'} alignItems={'center'}>
            <InputLabel type='text' onchange={(e:any)=>setIdentificacao(e)} label='Identificacao' 
          placeholder='Id, numero do bilhete ou passaporte'/>
             <Box marginTop={5}>
                <SelectCustomValue setChange={(e:any)=>{setTipoIdentificacao(e)}} borderRadius={2} width='170px' items={[{label:'Passaporte', value:'passport'},{label:'Bilhete', value:'bilhete'},
                   {label:'NIF', value:'NIF'}
                ]}/>          
             </Box>
            
          </HStack>
          <VStack width={'100%'} alignItems={'flex-start'}>
            <Text fontSize={12} color={'gray'}>Profissao</Text>
            <SelectCustomValue setChange={(e:any)=>{setProfissao(e[0])}} borderRadius={2} 
            width='100%' items={[{label:'Agente Imobiliario', value:'agente'},
                   {label:'Funcionario Publico', value:'funcionario publico'},
                   {label:'Desempregado', value:'desempregado'},
                   {label:'Comerciante', value:'comerciante'},
                   {label:'Empreendedor', value:'empreendedor'},
                   {label:'Ramo petrolifero', value:'ramo petrolifero'},
                   {label:'Outro', value:'outro'}
                ]}/>
            <Box width={'100%'} display={profissao[0] === 'outro' ? 'block' : 'none'}>
              <InputLabel placeholder='Descreva sua profissao' type='text' onchange={(e:any)=>setProfissaoOutro(e)} label='Profissao'/>
            </Box>
            
          </VStack>
          <InputLabel type='password' onchange={(e:any)=>setPassword(e)} label='Senha' 
          placeholder='digite sua senha'/>
          <InputLabel type='password' onchange={(e:any)=>setCorfimPassworf(e)} label='Confirmar Senha' 
          placeholder='digite sua senha'/>
          <InputLabel type='phone' onchange={(e:any)=>setPhoneNumber(e)} label='Numero de Telefone' 
          placeholder='digite seu numero de telefone'/>
          <Button onClick={submeter} bg={'#d33434'} width={'100%'}>Criar conta</Button>
          <Link href={'/auth/entrar'}><Text fontSize={10} color={'gray'}>Ja tem conta na NJINGA clique <span style={{color:'red'}}>aqui</span></Text> </Link>
        </VStack>
    </VStack>
  )
}

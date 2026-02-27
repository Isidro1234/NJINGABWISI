'use client'
import CustomCard from '@/components/custom/CustomCard'
import CustomReCard from '@/components/custom/CustomReCard'
import InputLabel from '@/components/custom/InputLabel'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {Toaster, toaster} from '../../../components/ui/toaster'
import Image from 'next/image'

export default function RegistarImovel() {
    const [propriedadeName, setPropriedadeName] = useState('')
    const [propriedadeOwner, setPropriedadeOwner] = useState('')
  
    async function check(value: string) {
         if(value === 'nao'){
        toaster.create({
            title:'Registro de Propriedade',
            description: `Infelizmente, apenas propriedades que pertencem ao usuário podem ser registradas no momento caso o usuario nao seja um agente imobiliario.
            Estamos trabalhando para permitir o registro de propriedades de terceiros em breve.
            Caso o senhor seja um agente imobiliário, por favor dirija-se para as definicoes de sua conta e solicite a verificação de sua conta como agente imobiliário para ter acesso a essa funcionalidade. 
            Agradecemos sua compreensão e paciência enquanto aprimoramos nossos serviços`,
            duration: 5000,
            type:'warning'
        })
        return;
    }
    setPropriedadeOwner(value)
    }
   
  return (
    <VStack alignItems={'center'} padding={5}paddingTop={10}  width={'100%'} >
      <CustomCard bg='#e9daf9' icon={<Image alt='icon' src={'/icons/registar.svg'} width={20} height={20}/>} description='bwisi register' title='Registrar Imóvel'>
        <VStack justifyContent={'center'}  alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={0} gap={4}>                 
                  <VStack>
                    <Text fontSize={14} color={'gray'}>Antes de registrar um imóvel, precisamos confirmar se ele realmente te pertence.</Text>
                  </VStack>
                  
                  <HStack width={'100%'} alignItems={'center'}>
                        <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Nome do Imóvel' placeholder='Ex: Casa de praia'/>
                        
                  </HStack>
                  <Box  width={'100%'}>
                            <Text fontSize={12} color={'gray'}>Esta propriedade te pertence?</Text>
                            <SelectCustomValue borderRadius={0} items={[{label:'sim', value:'sim'},{label:'nao',value:'nao'}]}
                                width='100%' setChange={(e:any)=>{check(e[0])}}/> 
                        </Box>
                  <HStack  width={'100%'}>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Endereço do Imóvel' placeholder='Ex: Rua das Flores, 123'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Municipio' placeholder='Ex: Luanda'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Provincia/Estado' placeholder='Ex: Luanda'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='País' placeholder='Ex: Angola'/>
                  </HStack>
                  <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Dimensão total do Imóvel' placeholder='Ex: 100m²'/>
                 <Box  width={'100%'}>
                            <Text fontSize={12} color={'gray'}>Que tipo de Imovel?</Text>
                            
                    <SelectCustomValue  borderRadius={0} items={[{label:'Anexo', value:'anexo'},
                    {label:'Casa',value:'casa'} , 
                    {label:'Apartamento',value:'apartamento'},
                    {label:'Mancao',value:'mancao'},
                    {label:'Condominio',value:'condominio'},
                    {label:'Casa informal',value:'casa informal'},
                    {label:'Outro',value:'outro'}]}
                                width='100%' setChange={(e:any)=>{check(e[0])}}/> 
                        </Box>
                 
                  <HStack>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Numero de Quartos' placeholder='Ex: 3'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Numero de Banheiros' placeholder='Ex: 2'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Numero de Salas de Estar' placeholder='Ex: 1'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Numero de Garagens' placeholder='Ex: 1'/>
                    <InputLabel type='text' onchange={(e:any)=>{console.log(e)}}
                                label='Numero de Suites' placeholder='Ex: 1'/>
                  </HStack>
            <Button width={'100%'} bg={'#4d4fec'}>Registrar Imóvel</Button>
        </VStack>
      </CustomCard>
      <Toaster/>
    </VStack>
  )
}

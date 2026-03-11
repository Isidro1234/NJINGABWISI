"use client"
import AccordionCustom from '@/components/custom/AccordionCustom'
import AvatarCustom from '@/components/custom/AvatarCustom'
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomHouseAdmin from '@/components/custom/CustomHouseAdmin'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomUipCard from '@/components/custom/CustomUipCard'
import InputLabel from '@/components/custom/InputLabel'
import UIPprint from '@/components/custom/UIPprint'
import { Toaster, toaster } from '@/components/ui/toaster'
import { store } from '@/logic/storemedia'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function DashboardAdmin() {
    const get_pedido_de_registo_de_casas = useLogicState((state:any)=>state.getpedidosderegisto_de_casa)
    const get_pedido_de_registo_de_agentes = useLogicState((state:any)=>state.getpedidosderegisto_de_agentes)
    const [pedido_de_registo_de_casas, setCasas] = useState<any[]>([]) 
    const [pedido_de_registo_de_agents, setAgents] = useState<any[]>([])
    const [previewdoc, setprevdocs] = useState<any>([])
    const inpuref = useRef<HTMLInputElement>(null)
    const inputref2 = useRef<HTMLInputElement>(null)
    const adicionar_funcio = useLogicState((state:any)=>state.adicionar_funcionario) 
    const [formulario_novo_funcionario, setFuncionario] = useState(()=>({
        nome:null,
        pais:null,
        provincia:null,
        comuna:null,
        municipio:null,
        distrito:null,
        rua:null,
        numero_do_bilhete:null,
        photo:null
    }))
useEffect(() => {
    async function get_casas() {
        const res = await get_pedido_de_registo_de_casas();
        const r = await get_pedido_de_registo_de_agentes()
        console.log('result:', res, typeof res)
        
        // Make sure it's always an array before setting
        if (Array.isArray(res) || Array.isArray(r)) {
            setCasas(res)
            setAgents(r)
        } else {
            console.error('Expected array but got:', res)
            setCasas([])
        }
    }
    get_casas()
}, [])
        function deletefiles(name:any){
           const res = previewdoc.filter((item:File)=> item?.name !== name )
           setprevdocs(res)
        }
       async function save_files(){
         const res = await Promise.all(
              previewdoc.map((item:File)=>{
                const storemedia = store({image:item, name:item?.name, type:item?.type})
                return storemedia
              })
         )
         return res
       }
       async function submeter_novo_funcionario(){
        if( !formulario_novo_funcionario.comuna ||
            !formulario_novo_funcionario.distrito ||
            !formulario_novo_funcionario.municipio ||
            !formulario_novo_funcionario.nome||
            !formulario_novo_funcionario.numero_do_bilhete ||
            !formulario_novo_funcionario.pais ||
            !formulario_novo_funcionario.provincia ||
            !formulario_novo_funcionario.rua ||
             previewdoc.length <= 0
        ){  
            toaster.create({
                duration:5000,
                title:'Lacunas vazias',
                type:"error",
                description:'porfavor preencha as lacunas'
            })
            return
        }
         const files = await save_files();
         const res = await adicionar_funcio(formulario_novo_funcionario , files);
         if(res){
            toaster.create({
                duration:5000,
                title:'Enviado',
                type:"success",
                description:'Funcionario adicionado com sucesso'
            })
            setFuncionario((prev)=>({
                ...prev,
                nome:null,
                pais:null,
                provincia:null,
                comuna:null,
                municipio:null,
                distrito:null,
                rua:null,
                numero_do_bilhete:null,
            }))

         }else{
            toaster.create({
                duration:5000,
                title:'Algo errado',
                type:"error",
                description:'Funcionario nao adicionado'
            })
         }
       }
       async function addfunciophoto(image:File){
            const storemedia = await store({image:image, name:image?.name, type:image?.type})
            setFuncionario((prev:any)=>({
                ...prev,
                photo:storemedia
            }))
       }
    console.log(pedido_de_registo_de_agents)
    return (
    <VStack  className='portal-conteiner' display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(360px,1fr))'} 
    alignItems={'flex-start'} width={'100%'}  bg={'#f6f6f6'} padding={10}>
        <CustomCard link='portal/propriedades' description='inta inc' title='Validar Imóveis' 
              icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30}/>}
               bg={'#E3EAFA'}>
                <VStack alignItems={'start'} width={'100%'}>
                   <Text fontSize={10} color={'gray'}>Pedidos de registo de Imóveis Recebidos</Text>
                    {pedido_de_registo_de_casas?.map((item:any,index:any)=>{
                    return(
                        <CustomHouseAdmin destination='Registos' id={item?.id} key={index} image={item?.formulario_imovel?.fotos_da_propriedade?.[0]} 
                        identificacao={[item?.formulario_imovel?.tenho_alguns_documentos,item?.formulario_imovel?.documentos_da_lista_de_documentos_completos]} 
                        name={"Imovel " + item?.formulario_imovel?.utente_distrito} 
                        location={"de " + item?.formulario_dono?.primeiro_nome + " " + item?.formulario_dono?.sobrenome}/> 
                    )
                   })}
                   
                </VStack>
        </CustomCard>
        <CustomCard bg={'#f6f6f6'} link='portal/Agentes' title='Agentes' 
              description='inta inc'
              icon={<Image src={'/icons/agent-logo.svg'} alt='imovel' width={30} height={30}/>}>
                 
            <VStack alignItems={'start'} width={'100%'}>
                   <Text fontSize={10} color={'gray'}>Pedidos de registo de Agentes Recebidos</Text>
                   {pedido_de_registo_de_agents?.map((item:any,index:any)=>{
                    return(
                        <CustomHouseAdmin destination='Registos_Agentes' id={item?.id} key={index} image={item?.photo} 
                        identificacao={item?.formulario?.identificacao} 
                        name={item?.nome?.split(' ')[0] + " " + item?.nome?.split(' ')[item?.nome?.split(' ').length -1]} 
                        location={"de " + item?.formulario?.provincia}/> 
                    )
                   })}
                </VStack>
                    
        </CustomCard>
        <CustomCard link='portal/pagamentos' description='inta inc' title='Emolumentos' 
              icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50}/>}
               bg={'#f6f6f6'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                    <Text fontSize={12} color={'gray'}>Pagamentos Recentes</Text>
                    <CustomECard/>
                </VStack>
         </CustomCard>
              <CustomCard link='portal/ValidaUIP' description='inta inc' title='Validar PIU' 
              icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25}/>}
               bg={'#E3FAF5'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
                    <Text fontSize={12} color={'gray'}>Validar PIU</Text>
                    <CustomUipCard/>
                </VStack>
              </CustomCard>
              <CustomCard link='/admin/portaladministrador/registo' description='inta inc' title='Registar Imóvel' 
              icon={<Image src={'/icons/registar.svg'} alt='uip' width={25} height={25}/>}
               bg={'#e9daf9'}>
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
                    <CustomReCard/>
                </VStack>
              </CustomCard>
             
              
              <CustomCard link='portal/FuncionariosGov' description='inta inc' title='Funcionarios Gov' 
              icon={<Image src={'/icons/gov.svg'} alt='uip' width={25} height={25}/>}
               bg={'#DFFCE7'}>
                <AccordionCustom>

        
                <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
        
                    {formulario_novo_funcionario?.photo &&
                    <AvatarCustom image={formulario_novo_funcionario?.photo} name='avatar'/>
                    }
                    
                    <VStack width={'100%'}>
                        <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, nome:e}))}} label='Nome' type='text' placeholder='Nome do Funcionario'/>
                        <HStack >
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, pais:e}))}} label='Pais' type='text' placeholder='Nacionalidade'/>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, provincia:e}))}} label='Provincia' type='text' placeholder='Provincia'/>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, municipio:e}))}} label='Municipio' type='text' placeholder='Municipio'/>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, comuna:e}))}} label='Comuna' type='text' placeholder='Comuna'/>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, distrito:e}))}} label='Distrito' type='text' placeholder='Distrito'/>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, rua:e}))}} label='Rua' type='text' placeholder='Rua'/>
                        </HStack>
                        <Box display={'flex'} justifyContent={'center'} cursor={'pointer'} padding={10} 
                        onClick={()=>{inputref2.current?.click()}} borderStyle={'dashed'} borderRadius={20} borderWidth={1} width={'100%'}>
                            <Text fontSize={12} color={'gray'}>Foto do funcionario</Text>
                            <Input type='file' onChange={(e:any)=>{addfunciophoto(e.target.files[0])}} 
                            ref={inputref2} display={'none'}/>
                        </Box>
                        <HStack width={'100%'}>
                            <InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, numero_do_bilhete:e}))}} label='Numero do bilhete' type='text' placeholder='Numero do bilhete'/>
                        </HStack>
                        <Text width={'100%'} color={'gray'} fontSize={12}>Envie a copia do bilhete e ou passaporte</Text>
                        <Box cursor={'pointer'} onClick={()=>{inpuref.current?.click()}} display={'flex'} justifyContent={'center'} width={'100%'} borderStyle={'dashed'} padding={10} borderRadius={20} borderWidth={1}>
                            <Input onChange={(e:any)=>{setprevdocs([...e.target.files])}} display={'none'} type='file' multiple ref={inpuref}/>
                            <Text color={'gray'} fontSize={12}>Enviar documentos</Text>
                        </Box>
                        <HStack gridTemplateColumns={'repeat(auto-fit,minmax(50px,1fr))'} display={'grid'} width={'100%'}>
                           {previewdoc?.map((item:any, index:any)=>{
                            return(
                                <VStack width={'100%'} key={index} position={'relative'}>
                                    <Button zIndex={100} right={1} size={"2xs"} onClick={()=>{deletefiles(item?.name)}} position={'absolute'} fontSize={10} borderRadius={50} bg={'red'}>deletar</Button>
                                    <Box width={50} height={50} position={'relative'}>
                                        <Image src={'/icons/file.svg'} fill alt=''/>
                                    </Box>
                                    <Text color={'gray'} fontSize={12}>{item?.name?.slice(0,10)}</Text>
                                </VStack>
                            )
                        })} 
                        </HStack>
                        
                        <Button onClick={submeter_novo_funcionario} fontSize={12} bg={'blue'} width={'100%'}>Adicionar Novo Funcionario</Button>
                    </VStack>
                   
            
                </VStack>
                </AccordionCustom>
                 <Text fontSize={12} color={'gray'}>Actuais Funcioarios Gov</Text>
                <CustomGovCard/>
                <Toaster/>
              </CustomCard>
    </VStack>
  )
}

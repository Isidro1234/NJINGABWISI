"use client"
import AccordionCustom from '@/components/custom/AccordionCustom'
import AvatarCustom from '@/components/custom/AvatarCustom'
import CustomCard from '@/components/custom/CustomCard'
import CustomECard from '@/components/custom/CustomECard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomHouseAdmin from '@/components/custom/CustomHouseAdmin'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomUipCard from '@/components/custom/CustomUipCard'
import InputLabel from '@/components/custom/InputLabel'
import { Toaster, toaster } from '@/components/ui/toaster'
import { store } from '@/logic/storemedia'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function DashboardAdmin() {

    const t = useTranslations('dashboardAdmin')

    const get_pedido_de_registo_de_casas = useLogicState((state:any)=>state.getpedidosderegisto_de_casa)
    const get_pedido_de_registo_de_agentes = useLogicState((state:any)=>state.getpedidosderegisto_de_agentes)

    const [pedido_de_registo_de_casas, setCasas] = useState<any[]>([]) 
    const [pedido_de_registo_de_agents, setAgents] = useState<any[]>([])
    const [previewdoc, setprevdocs] = useState<any>([])
    const router = useRouter()

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
        const [res, r] = await Promise.all([
            get_pedido_de_registo_de_casas(),
            get_pedido_de_registo_de_agentes()
        ])
        setCasas(res)
        setAgents(r)
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

if(
 !formulario_novo_funcionario.comuna ||
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
     title:t('messages.emptyFields'),
     type:"error",
     description:t('messages.fillFields')
 })
 return
}

const files = await save_files();
const res = await adicionar_funcio(formulario_novo_funcionario , files);

if(res){

 toaster.create({
     duration:5000,
     title:t('messages.sent'),
     type:"success",
     description:t('messages.employeeAdded')
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
     title:t('messages.error'),
     type:"error",
     description:t('messages.employeeNotAdded')
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

return (

<VStack
className='portal-conteiner'
display={'grid'}
gridTemplateColumns={'repeat(auto-fit, minmax(360px,1fr))'}
alignItems={'flex-start'}
width={'100%'}
bg={'#f6f6f6'}
padding={10}
>

<CustomCard
link='portal/propriedades'
description='inta inc'
title={t('cards.validateProperties')}
icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30}/>}
bg={'#E3EAFA'}
>

<VStack alignItems={'start'} width={'100%'}>

<Text fontSize={10} color={'gray'}>
{t('cards.propertyRequests')}
</Text>

{pedido_de_registo_de_casas?.map((item:any,index:any)=>(
<CustomHouseAdmin
casa_info={item}
destination='Registos'
id={item?.id}
key={index}
image={item?.formulario_imovel?.fotos_da_propriedade?.[0]}
estado={item?.estado}
docref={item?.ref}
name={"Imovel " + item?.formulario_imovel?.utente_distrito}
location={"de " + item?.formulario_dono?.primeiro_nome + " " + item?.formulario_dono?.sobrenome}
/>
))}

</VStack>
</CustomCard>

<CustomCard
bg={'#f6f6f6'}
link='portaladministrador/agentes'
title={t('cards.agents')}
description='inta inc'
icon={<Image src={'/icons/agent-logo.svg'} alt='imovel' width={30} height={30}/>}
>

<VStack alignItems={'start'} width={'100%'}>

<Text fontSize={10} color={'gray'}>
{t('cards.agentRequests')}
</Text>

{pedido_de_registo_de_agents?.map((item:any,index:any)=>(
<CustomHouseAdmin
casa_info={item}
destination='Registos_Agentes'
id={item?.id}
key={index}
image={item?.photo}
estado={item?.estado}
docref={item?.ref}
name={item?.nome?.split(' ')[0] + " " + item?.nome?.split(' ')[item?.nome?.split(' ').length -1]}
location={"de " + item?.formulario?.provincia}
/>
))}

</VStack>
</CustomCard>

<CustomCard
link='portal/pagamentos'
description='inta inc'
title={t('cards.fees')}
icon={<Image src={'/icons/coin.svg'} alt='coin' width={50} height={50}/>}
bg={'#f6f6f6'}
>

<VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>

<Text fontSize={12} color={'gray'}>
{t('cards.recentPayments')}
</Text>

<Text fontSize={12} color={'gray'}>Criar Servicos e Impostos</Text>
<Button onClick={()=>{router.push('/admin/portaladministrador/pagamentos')}} 
borderRadius={50} bg={'#4264fc'}>Criar</Button>
</VStack>
</CustomCard>

<CustomCard
link='portal/ValidaUIP'
description='inta inc'
title={t('cards.validateUIP')}
icon={<Image src={'/icons/uip.svg'} alt='uip' width={25} height={25}/>}
bg={'#E3FAF5'}
>

<VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>

<Text fontSize={12} color={'gray'}>
{t('cards.validateUIP')}
</Text>

<CustomUipCard/>

</VStack>
</CustomCard>

<CustomCard
link='/admin/portaladministrador/registo'
description='inta inc'
title={t('cards.registerProperty')}
icon={<Image src={'/icons/registar.svg'} alt='uip' width={25} height={25}/>}
bg={'#e9daf9'}
>

<VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
<CustomReCard link='/admin/portaladministrador/registo'/>
</VStack>

</CustomCard>

<CustomCard
link='portal/FuncionariosGov'
description='inta inc'
title={t('cards.govEmployees')}
icon={<Image src={'/icons/gov.svg'} alt='uip' width={25} height={25}/>}
bg={'#DFFCE7'}
>

<AccordionCustom>

<VStack alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>

{formulario_novo_funcionario?.photo &&
<AvatarCustom image={formulario_novo_funcionario?.photo} name='avatar'/>
}

<VStack width={'100%'}>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, nome:e}))}}
label={t('fields.name')}
type='text'
placeholder={t('fields.employeeName')}
/>

<HStack>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, pais:e}))}}
label={t('fields.country')}
type='text'
placeholder={t('fields.nationality')}
/>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, provincia:e}))}}
label={t('fields.province')}
type='text'
placeholder={t('fields.province')}
/>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, municipio:e}))}}
label={t('fields.municipality')}
type='text'
placeholder={t('fields.municipality')}
/>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, comuna:e}))}}
label={t('fields.comuna')}
type='text'
placeholder={t('fields.comuna')}
/>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, distrito:e}))}}
label={t('fields.district')}
type='text'
placeholder={t('fields.district')}
/>

<InputLabel onchange={(e:any)=>{setFuncionario((prev)=>({...prev, rua:e}))}}
label={t('fields.street')}
type='text'
placeholder={t('fields.street')}
/>

</HStack>

<Box
display={'flex'}
justifyContent={'center'}
cursor={'pointer'}
padding={10}
onClick={()=>{inputref2.current?.click()}}
borderStyle={'dashed'}
borderRadius={20}
borderWidth={1}
width={'100%'}
>

<Text fontSize={12} color={'gray'}>
{t('fields.employeePhoto')}
</Text>

<Input
type='file'
onChange={(e:any)=>{addfunciophoto(e.target.files[0])}}
ref={inputref2}
display={'none'}
/>

</Box>

<HStack width={'100%'}>

<InputLabel
onchange={(e:any)=>{setFuncionario((prev)=>({...prev, numero_do_bilhete:e}))}}
label={t('fields.idNumber')}
type='text'
placeholder={t('fields.idNumber')}
/>

</HStack>

<Text width={'100%'} color={'gray'} fontSize={12}>
{t('fields.uploadId')}
</Text>

<Box
cursor={'pointer'}
onClick={()=>{inpuref.current?.click()}}
display={'flex'}
justifyContent={'center'}
width={'100%'}
borderStyle={'dashed'}
padding={10}
borderRadius={20}
borderWidth={1}
>

<Input
onChange={(e:any)=>{setprevdocs([...e.target.files])}}
display={'none'}
type='file'
multiple
ref={inpuref}
/>

<Text color={'gray'} fontSize={12}>
{t('fields.uploadDocuments')}
</Text>

</Box>

<HStack gridTemplateColumns={'repeat(auto-fit,minmax(50px,1fr))'} display={'grid'} width={'100%'}>

{previewdoc?.map((item:any, index:any)=>(
<VStack width={'100%'} key={index} position={'relative'}>

<Button
zIndex={100}
right={1}
size={"2xs"}
onClick={()=>{deletefiles(item?.name)}}
position={'absolute'}
fontSize={10}
borderRadius={50}
bg={'red'}
>
{t('buttons.delete')}
</Button>

<Box width={50} height={50} position={'relative'}>
<Image src={'/icons/file.svg'} fill alt=''/>
</Box>

<Text color={'gray'} fontSize={12}>
{item?.name?.slice(0,10)}
</Text>

</VStack>
))}

</HStack>

<Button
onClick={submeter_novo_funcionario}
fontSize={12}
bg={'blue'}
width={'100%'}
>
{t('buttons.addEmployee')}
</Button>

</VStack>

</VStack>

</AccordionCustom>

<Text fontSize={12} color={'gray'}>
{t('cards.currentGovEmployees')}
</Text>

<CustomGovCard/>

<Toaster/>

</CustomCard>

</VStack>

)

}


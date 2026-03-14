"use client"
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import AvatarCustom from './AvatarCustom'
import SelectCustomValue from './SelectCustomValue'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLogicState } from '@/states/useLogicState'
import { Toaster, toaster } from '../ui/toaster'

export default function CustomHouseAdmin({name,casa_info,docref, location,estado, image ,id , destination}:
    {name:string,casa_info:any,docref:string, location:string, estado:string, image:string, id:string , destination:string}) {
        const router = useRouter();
        const aceitar_ou_negar_imovel = useLogicState((state:any)=>state.aceitar_or_negar_submission);
        const [status, setStatus ] =  useState<any>('')
        const  [resposta, setresposta] = useState('')
        async function submeterEnvio(tipo: string) {
    const comuna = casa_info?.formulario_imovel?.utente_comuna || ''

    const casa_info_res = {
        documentos_do_dono_antigo: [{
            uip: casa_info?.formulario_imovel?.numero_do_bilhete_ou_uip_do_dono_antigo || '',
            documentos: casa_info?.formulario_imovel?.foto_da_identificacao_do_dono_antigo || [],
            nome: casa_info?.formulario_imovel?.dono_antigo || ''
        }],
        // ✅ Add || [] fallback to every array spread
        meus_documentos: [
            ...(casa_info?.formulario_imovel?.documentos_da_lista_de_documentos_completos || []),
            ...(casa_info?.formulario_imovel?.tenho_alguns_documentos || [])
        ],
        fotos_da_propriedade: casa_info?.formulario_imovel?.fotos_da_propriedade || [],
        location: `${casa_info?.formulario_imovel?.utente_rua || ''}, ${casa_info?.formulario_imovel?.utente_distrito || ''}, ${comuna}, ${casa_info?.formulario_imovel?.utente_municipio || ''}, ${casa_info?.formulario_imovel?.utente_estado || ''}`,
        image: image || '',
        id: id || '',
        imovel_: casa_info?.formulario_imovel?.tipo_de_imovel || '',
        tipo_imovel: casa_info?.formulario_imovel?.categoria_de_imovel || '',
        area_total: casa_info?.formulario_imovel?.area_total_do_imove || '',
    }

    if (tipo === 'aprovado') {
        console.log(casa_info_res)
        if (!status) {
            toaster.create({
                title: 'Porfavor adicione um estado para o imovel',
                description: 'Porfavor adicione um estado para o imovel que pretende submeter',
                duration: 5000,
                type: 'error'
            })
            return
        }
        const res = await aceitar_ou_negar_imovel(status, id, casa_info_res, destination, docref)
        setStatus(tipo)
        if (res.message) {
            setresposta(res.res)
            toaster.create({
                title: 'Imovel enviado',
                description: 'Imovel verificado com sucesso',
                duration: 5000,
                type: 'success'
            })
        } else {
            toaster.create({
                title: 'Porfavor verifique sua connecao',
                description: 'Porfavor verifique sua conecao a internet, caso o problema continue contacte-nos em: suportetecnico@inta.tech',
                duration: 5000,
                type: 'error'
            })
        }
        return
    }

    const res = await aceitar_ou_negar_imovel(tipo, id, casa_info_res, destination, docref)
    if (res.message) {
        setresposta(res.res)
        setStatus(tipo)
    } else {
         setStatus(tipo)
        console.log('erro')
    }
}
  return (
    <HStack position={'relative'} borderWidth={1} borderRadius={10} bg={ resposta == 'aprovado' ? "#f0fff5" : '#FAFAFA'} padding={5} marginTop={4} width={'100%'} alignItems={'start'}>
        <AvatarCustom image={image} name={name}/>
        <VStack justifyContent={'center'} gap={0} alignItems={'flex-start'} flex={1}>
            <Text color={'gray'}  marginTop={1.5} lineHeight={1.2} fontSize={12}>{name || ''}</Text>
            <Text lineHeight={1.2} fontSize={10} color={'gray'}>{location || ""}</Text>
            <Box padding={2} paddingLeft={4} paddingRight={4} bg={(estado || status) === "aprovado" ?  "#47ff9a"   :'white'} bottom={2} left={2} position={'absolute'} borderRadius={50} >
                <Text fontSize={10} color={(estado || status) !== "aprovado"? "gray" : 'white'}>{status|| estado}</Text>
            </Box>
        </VStack>
        <VStack alignItems={'end'}>
            <Text fontSize={10} color={'gray'}>Estado do Processo</Text>
            <HStack>
                <Box onClick={()=>{router.push(`/admin/portaladministrador/documentos/${id}?tipo=${destination}`)}} position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#34FFA4'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/file-t.svg'} 
                   fill/>
                </Box>
                <SelectCustomValue  width='100px' setChange={(e:any)=>{setStatus(e[0])}} 
                borderRadius={50} items={[{label:'aprovado', value:'aprovado'},
                    {label:'incompleto', value:'incompleto'},
                    {label:'negado', value:'negado'}
                ]}/>
            </HStack>
            <HStack>
                <Box onClick={()=>{submeterEnvio('aprovado')}} position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#34FFA4'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/aceitar.svg'} 
                   fill/>
                </Box>
                <Box onClick={()=>{submeterEnvio('incompleto')}} position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#FFBB34'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/incompleto.svg'} fill/>
                </Box>
                <Box onClick={()=>{submeterEnvio('negado')}} position={'relative'} cursor={'pointer'} margin={0} padding={0} bg={'#FF3434'} borderRadius={50} width={5} height={5}>
                    <Image alt='aceitar' src={'/icons/negar.svg'} fill/>
                </Box>
            </HStack>
        </VStack>
        <Toaster/>
    </HStack>
  )
}

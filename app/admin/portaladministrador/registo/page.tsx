"use client"
import CustomCard from '@/components/custom/CustomCard';
import CustomHouseRegisterForm from '@/components/custom/CustomHouseRegisterForm';
import TabsCustom from '@/components/custom/CustomTabc';
import Form1 from '@/components/custom/Form1';
import Form2 from '@/components/custom/Form2';
import { Toaster } from '@/components/ui/toaster';
import { decryptdata } from '@/logic/encryptdata';
import { useLogicState } from '@/states/useLogicState';
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react'

export default function Registar() {
    const [form1, setform1] = useState<any>({});
    const [form2, setform2] = useState<any>({})
    const buttonref = useRef<HTMLElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [enviar, setenviar] = useState(0)
    const register = useLogicState((state:any)=>state?.registerhouse)
    async function clicking() {
    if (!buttonref.current) return
    const doc = buttonref.current.getElementsByTagName('button')
    const cur = currentIndex + 1
    if (cur < doc.length) {
        doc[cur].click()  
    }
}

function clickinganterior() {
    if (!buttonref.current) return
    const doc = buttonref.current.getElementsByTagName('button')
    const cur = currentIndex - 1
    if (cur >= 0) {
        doc[cur].click()
    }
}
    async function enviarForms() {
    if (currentIndex < 2) {
        clicking()
        return
    }

    if( currentIndex === 2){
      const uip: string = localStorage.getItem('uip') || ""
      const decrypt = decryptdata(uip)?.id
      await register(form1, form2, decrypt)
      //console.log(decrypt)
    }
    
}
    
  return (
    <VStack alignItems={'center'} padding={5}paddingTop={10}  width={'100%'} >
      <CustomCard bg='#e9daf9' icon={<Image alt='icon' src={'/icons/registar.svg'} width={20} height={20}/>} description='inta register' title='Registrar Imóvel'>
        
        <VStack flexWrap={'wrap'} justifyContent={'center'}  alignItems={'flex-start'} width={'100%'}  paddingTop={0} gap={4}>                 
                 <TabsCustom   change={(e: any) => { setCurrentIndex(Number(e)) }} 
                  buttonref={buttonref}
                 form1={
                  <CustomHouseRegisterForm
                  title='Governo de Angola'
                  subtitle='Ministerio da Urbanizacao e Transporte'
                  typeOfform='Formulario de Possecao de Imovel'>
                      <VStack>
                        <Form1 getform={(e:any)=>{setform1(e)}} />
                      </VStack>
                  </CustomHouseRegisterForm>
                 }
                 form2={ <CustomHouseRegisterForm
                  title='Governo de Angola'
                  subtitle='Ministerio da Urbanizacao e Transporte'
                  typeOfform='Formulario de Possecao de Imovel'>
                      <VStack>
                        <Form2 getform2={(e:any)=>{setform2(e)}}/>
                      </VStack>
                  </CustomHouseRegisterForm>}
                  preview={ <CustomHouseRegisterForm
                  title='Governo de Angola'
                  subtitle='Ministerio da Urbanizacao e Transporte'
                  typeOfform='Formulario de Possecao de Imovel'>
                    <HStack gridTemplateColumns={'repeat(auto-fit,minmax(250px,1fr))'} display={'grid'} width={'100%'} alignItems={'flex-start'}>

                      <VStack alignItems={'flex-start'} borderWidth={1} borderRadius={10} padding={7}>
                        <Text className='formulariopreviewtitle'>Formulario 1</Text>
                        <HStack gap={4} justifyContent={'start'} width={'100%'}>
                          <VStack alignItems={'start'}>
                            <Text className='formulariopreviewtitle'>Primeiro Nome:</Text>
                            <Text className='formulariopreviewtitle'>Nome do Meio:</Text>
                            <Text className='formulariopreviewtitle'>Sobrenome:</Text>
                            <Text className='formulariopreviewtitle'>Pais:</Text>
                            <Text className='formulariopreviewtitle'>Estado:</Text>
                            <Text className='formulariopreviewtitle'>Municipio:</Text>
                            <Text className='formulariopreviewtitle'>Comuna:</Text>
                            <Text className='formulariopreviewtitle'>Destrito:</Text>
                            <Text className='formulariopreviewtitle'>Rua:</Text>
                            <Text className='formulariopreviewtitle'>Tipo de Identificacao:</Text>
                            <Text className='formulariopreviewtitle'>Identificacao:</Text>
                          </VStack>
                          <VStack alignItems={'end'}>
                            <Text className='formulariopreviewtitle'>{form1?.primeiro_nome}</Text>
                            <Text className='formulariopreviewtitle'>{form1?.nome_do_meio}</Text>
                            <Text className='formulariopreviewtitle'>{form1?.sobrenome}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_pais}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_estado}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_municipio}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_comuna}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_destrito}</Text>
                            <Text className='formulariopreviewtitle'>{form1.utente_rua}</Text>
                            <Text className='formulariopreviewtitle'>{form1.tipo_de_identificacao}</Text>
                            <Text className='formulariopreviewtitle'>{form1.numero_de_identificacao}</Text>
                          </VStack>
                        </HStack>
                        
                        <VStack width={'100%'}>
                          <Text className='formulariopreviewtitle'>Identificacao fotos</Text>
                          {form1?.fotos_de_identificacao?.map((item:any, index:any)=>{
                            return (<Image key={index} src={item} width={200} height={200} alt={`${index}`}/>)
                          })}
                        </VStack>
                      </VStack>
                          <VStack>
                          <HStack padding={7} borderWidth={1} borderRadius={10} gap={4} justifyContent={'start'} width={'100%'}>
                          <VStack alignItems={'start'}>
                            <Text className='formulariopreviewtitle'>Formulario 2</Text>
                            <Text className='formulariopreviewtitle'>País:</Text>
                            <Text className='formulariopreviewtitle'>Estado / Província:</Text>
                            <Text className='formulariopreviewtitle'>Município:</Text>
                            <Text className='formulariopreviewtitle'>Comuna:</Text>
                            <Text className='formulariopreviewtitle'>Distrito:</Text>
                            <Text className='formulariopreviewtitle'>Rua:</Text>
                            <Text className='formulariopreviewtitle'>É dono do imóvel:</Text>
                            <Text className='formulariopreviewtitle'>É agente imobiliário:</Text>
                            <Text className='formulariopreviewtitle'>Possui documentação completa:</Text>
                            <Text className='formulariopreviewtitle'>Possui algum documento:</Text>
                            <Text className='formulariopreviewtitle'>Categoria do imóvel:</Text>
                            <Text className='formulariopreviewtitle'>UIP:</Text>
                            <Text className='formulariopreviewtitle'>Data de compra:</Text>
                            <Text className='formulariopreviewtitle'>Dono anterior:</Text>
                            <Text className='formulariopreviewtitle'>Novo dono:</Text>
                            <Text className='formulariopreviewtitle'>Nome do vendedor / agente:</Text>
                            <Text className='formulariopreviewtitle'>Tipo de identificação do dono anterior:</Text>
                            <Text className='formulariopreviewtitle'>Número do bilhete / UIP do dono anterior:</Text>
                            <Text className='formulariopreviewtitle'>Tipo de imóvel:</Text>
                            <Text className='formulariopreviewtitle'>Número de aprovação do projecto:</Text>
                            <Text className='formulariopreviewtitle'>Área total:</Text>
                            <Text className='formulariopreviewtitle'>Comprimento:</Text>
                            <Text className='formulariopreviewtitle'>Largura:</Text>
                          </VStack>
                          <VStack alignItems={'end'}>
                                <Text className='formulariopreviewtitle'>{form2.utente_pais}</Text>
                                <Text className='formulariopreviewtitle'>{form2.utente_estado}</Text>
                                <Text className='formulariopreviewtitle'>{form2.utente_municipio}</Text>
                                <Text className='formulariopreviewtitle'>{form2.utente_comuna}</Text>
                                <Text className='formulariopreviewtitle'>{form2.utente_distrito}</Text>
                                <Text className='formulariopreviewtitle'>{form2.utente_rua}</Text>
                                <Text className='formulariopreviewtitle'>{form2.sou_dono_do_imovel}</Text>
                                <Text className='formulariopreviewtitle'>{form2.sou_agente_imobiliario}</Text>
                                <Text className='formulariopreviewtitle'>{form2.tenho_documento_completo}</Text>
                                <Text className='formulariopreviewtitle'>{form2.tenho_documentos}</Text>
                                <Text className='formulariopreviewtitle'>{form2.categoria_de_imovel}</Text>
                                <Text className='formulariopreviewtitle'>{form2.verificar_uip}</Text>
                                <Text className='formulariopreviewtitle'>{form2.data_da_compra_do_imove}</Text>
                                <Text className='formulariopreviewtitle'>{form2.dono_antigo}</Text>
                                <Text className='formulariopreviewtitle'>{form2.novo_dono}</Text>
                                <Text className='formulariopreviewtitle'>{form2.nome_do_vendedor_ou_agente_imobiliario}</Text>
                                <Text className='formulariopreviewtitle'>{form2.tipo_de_identificacao_do_dono_antigo}</Text>
                                <Text className='formulariopreviewtitle'>{form2.numero_do_bilhete_ou_uip_do_dono_antigo}</Text>
                                <Text className='formulariopreviewtitle'>{form2.tipo_de_imovel}</Text>
                                <Text className='formulariopreviewtitle'>{form2.numero_de_aprovacao_do_projecto}</Text>
                                <Text className='formulariopreviewtitle'>{form2.area_total_do_imove}</Text>
                                <Text className='formulariopreviewtitle'>{form2.comprimento_da_propriedade}</Text>
                                <Text className='formulariopreviewtitle'>{form2.largura_da_propriedade}</Text>
                          </VStack>
                        </HStack>
                          </VStack>
                       </HStack>
                  </CustomHouseRegisterForm>}
                 />
                 
                <HStack justifyContent={'flex-end'} width={'100%'} marginTop={4} gap={2} alignItems={'center'}>
                  <Button fontSize={12}  borderRadius={50} bg={'blue'} onClick={clickinganterior}>Anterior</Button>
                  <Button fontSize={12}  borderRadius={50} bg={'blue'} onClick={enviarForms}>{currentIndex >= 2 ? "Submit" : "Proximo"}</Button>
                </HStack> 
        </VStack>
      </CustomCard>
      <Toaster/>
    </VStack>
  )
}
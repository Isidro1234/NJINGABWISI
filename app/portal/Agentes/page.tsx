"use client"
import CustomHouseRegisterForm from '@/components/custom/CustomHouseRegisterForm'
import InputLabel from '@/components/custom/InputLabel'
import SelectCustomValue from '@/components/custom/SelectCustomValue'
import { Toaster, toaster } from '@/components/ui/toaster'
import { angola, municipos_angola } from '@/logic/countries'
import { decryptdata } from '@/logic/encryptdata'
import { store } from '@/logic/storemedia'
import { useLogicState } from '@/states/useLogicState'
import { Box, Button, Checkbox, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { Country, State } from 'country-state-city'
import Image from 'next/image'
import React, { useCallback, useMemo, useRef, useState } from 'react'

interface Form1Props {
  getform: Function
}

const IDENTIFICATION_ITEMS = [
  { value: 'passaporte', label: 'Passaporte' },
  { value: 'bilhete', label: 'Bilhete' }
]

const ANGOLA_CODES = ['AO', 'AGO']
export default function Agentes() {
  const inputref = useRef<HTMLInputElement>(null)
  const registar_agente = useLogicState((state:any)=>state.registar_agente)
  const [previewdocs, setpreviewdocs] = useState(()=>({
    files:[],
  }))
  const [formulario1, setformulario] = useState(()=>({
    pais:null,
    provincia:null,
    municipio:null,
    comuna:null,
    acitou_termos:null,
    identificacao:[],
    distrito:null,
    rua:null
  }))
  const countries = useMemo(() => {
      return Country.getAllCountries().map((item) => ({
        value: item.isoCode,
        label: item.name
      }))
    }, [])
  
    const isAngola = useMemo(
      () => ANGOLA_CODES.includes(formulario1?.pais || ""),
      [formulario1?.pais]
    )
  
    const states = useMemo(() => {
      if (isAngola) return angola
      return State.getStatesOfCountry(formulario1?.pais || 'AF').map((item) => ({
        value: item.isoCode,
        label: item.name
      }))
    }, [formulario1.pais, isAngola])
  
    const municipios = useMemo(() => {
      const found = municipos_angola.find((item) => item?.province === formulario1.provincia)
      return found?.municipalities.map((m) => ({ value: m, label: m })) || []
    }, [formulario1.provincia])
  
    const comunas = useMemo(() => {
      for (const province of municipos_angola) {
        const found = province?.municipio.find((cm) => cm.nome === formulario1.municipio)
        if (found) return found.comunas.map((cm: any) => ({ value: cm, label: cm }))
      }
      return []
    }, [formulario1.municipio])
  
    const showComunas = comunas.length > 0 && comunas[0]?.value !== '';
     const set = useCallback((field: string) => (e: any) => {
        setformulario((prev) => ({ ...prev, [field]: e }))
      }, [])
      function download(){
       const crl = document.createElement('a');
       crl.href = 'https://njinga-worker.njinga.workers.dev/guia.pdf';
       crl.download = "Livro-GUIA-PARA-AGENTES-&-INTERMEDIARIOS";
       document.body.appendChild(crl)
       crl.click()
       document.body.removeChild(crl)
      }

       function arraypreview(files:any){
         setpreviewdocs((prev:any)=>({...prev, files:[...files]}))
         console.log(files)
       }
       function deletefile(name:any){
          const filet = previewdocs.files.filter((it:any)=> it?.name !== name);
          setpreviewdocs((prev)=>({...prev, files:filet}))
       }
    
      async function submit(){
        if(!formulario1.acitou_termos || previewdocs.files.length <= 0 || !formulario1?.pais ||
           !formulario1.provincia || !formulario1.rua || !formulario1.distrito) {
            toaster.create({
              title:'Porfavor preencha todas as lacunas',
              duration:5000,
              type:"error"
            })
            return
          }
         const docs = await Promise.all(
          previewdocs.files.map((item)=>{
            return process(item)
          })
         )
         const updatedForm = { ...formulario1, identificacao: docs || [] }
         setformulario((prev:any)=>({...prev, identificacao:docs || []}))
         await enviar(updatedForm)
      }
      async function enviar (form:any){
         const decrypt:any = localStorage.getItem('uip');
         const uip = decryptdata(decrypt)?.id;
         const res = await registar_agente(form, uip);
         
      }
      async function process(file:any){
         const storemeadia = await store({image:file,name:file.name, type:file.type})
         return storemeadia
      }
      console.log(formulario1)
  return (
    <VStack padding={10} width={'100%'}  bg={'#f6f6f6'}>
        <Box bg={'white'} borderRadius={20} padding={10}>
            <CustomHouseRegisterForm
                  title='Governo de Angola'
                  subtitle='Ministerio da Urbanização  e Transporte'
                  typeOfform='Formulario de Registo de Agente Imobiliário & Intermediário.'>

                    <VStack>
                      <HStack width={'100%'} display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(250px, 1fr))'}>
                              <Box display={'flex'} flexDirection={'column'} gap={1}>
                                <Text fontSize={12} color={'gray'}>País de Nascimento</Text>
                                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, pais: e[0] }))}
                                  borderRadius={0} width={'100%'} items={countries} />
                              </Box>
                      
                              <Box display={'flex'} flexDirection={'column'} gap={1}>
                                <Text fontSize={12} color={'gray'}>Estado/Província</Text>
                                <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, provincia: e[0] }))}
                                  borderRadius={0} width={'100%'} items={states} />
                              </Box>
                      
                              {isAngola ? (
                                <>
                                  <Box display={'flex'} flexDirection={'column'} gap={1}>
                                    <Text fontSize={12} color={'gray'}>Município</Text>
                                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, municipio: e[0] }))}
                                      borderRadius={0} width={'100%'} items={municipios} />
                                  </Box>
                      
                                  <Box display={showComunas ? 'flex' : 'none'} flexDirection={'column'} gap={1}>
                                    <Text fontSize={12} color={'gray'}>Comuna</Text>
                                    <SelectCustomValue setChange={(e: any) => setformulario((p) => ({ ...p, comuna: e[0] }))}
                                      borderRadius={0} width={'100%'} items={comunas} />
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <InputLabel onchange={(set('municipio'))} type='text' placeholder='Município' label='Município' />
                                  <InputLabel onchange={set('comuna')} type='text' placeholder='Comuna' label='Comuna' />
                                </>
                              )}
                      
                              <InputLabel onchange={set('distrito')} type='text' placeholder='Distrito' label='Distrito' />
                              <InputLabel onchange={set('rua')} type='text' placeholder='Rua' label='Rua' />
                            </HStack>
                            <VStack marginTop={4} alignItems={'start'} width={'100%'}>
                                        <Text textDecoration={'underline'} fontSize={12} color={'gray'}>
                                        Termos e Responsabilidades do Agente Imobiliário ou Intermediário
                                        </Text>

                                        <VStack width={'100%'} alignItems={'start'}>

                                        <Text  maxWidth={370} fontSize={12} color={'gray'}>
                                        1. O agente deverá portar e utilizar o seu cartão UIP sempre que estiver em exercício das suas funções profissionais.
                                        </Text>

                                        <Text  maxWidth={370} fontSize={12} color={'gray'}>
                                        2. O agente compromete-se a fornecer informações corretas, claras e verificáveis aos clientes.
                                        </Text>

                                        <Text  maxWidth={370} fontSize={12} color={'gray'}>
                                        3. O agente deverá apresentar tabelas de preços transparentes e previamente definidas aos clientes.
                                        </Text>

                                        <Text  maxWidth={370} fontSize={12} color={'gray'}>
                                        4. O agente deverá informar previamente o cliente sobre qualquer informação relevante ou necessária para a realização da operação imobiliária.
                                        </Text>

                                        <Text  maxWidth={370} fontSize={12} color={'gray'}>
                                        5. É estritamente proibido ao agente aceitar ou solicitar gasosa, suborno ou qualquer forma de benefício ilícito no exercício das suas funções.
                                        </Text>

                                        <Text maxWidth={370} fontSize={12} color={'gray'}>
                                        6. Qualquer fraude ou tentativa de fraude será imediatamente comunicada às autoridades competentes e poderá resultar na suspensão ou cancelamento do UIP do agente por tempo indeterminado.
                                        </Text>

                                        <Text maxWidth={370} fontSize={12} color={'gray'}>
                                        7. O agente ou intermediário deverá cumprir integralmente as normas, regulamentos e diretrizes estabelecidas no Livro-Guia para Agentes e Intermediários da plataforma.
                                        </Text>

                                        <Text maxWidth={370} fontSize={12} color={'gray'}>
                                        8. O agente ou intermediário detém o direito de recusar o atendimento de qualquer cidadão, desde que existam motivos justificáveis e que tal recusa não seja baseada em discriminação racial, de género, religião, nacionalidade ou orientação sexual.
                                        </Text>

                                        <Text maxWidth={370} fontSize={12} color={'gray'}>
                                        9. As comissões relativas à venda ou intermediação de imóveis deverão ser previamente acordadas entre as partes envolvidas na transação, nomeadamente o proprietário do imóvel e o agente ou intermediário.
                                        </Text>

                                        <Text maxWidth={370} fontSize={12} color={'gray'}>
                                        10. Qualquer situação não prevista nestes termos ou no Livro-Guia do Agente e Intermediário será analisada e tratada de acordo com a legislação vigente da República de Angola.
                                        </Text>
                              </VStack>
                              
                              <Checkbox.Root onCheckedChange={(e:any)=>{setformulario((prev)=>({...prev, acitou_termos:e?.checked}))}}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label fontSize={12} color={'gray'}>Aceitar Termos e Responcabilidades</Checkbox.Label>
                              </Checkbox.Root>
                              <Text fontSize={12} color={'gray'}>Porfavor submeta seu bilhete de identidade ou Passaporte clicando na caixa abaixo</Text>
                              <Box cursor={'pointer'} borderStyle={"dashed"} alignItems={'center'} justifyContent={'center'} display={'flex'} borderRadius={10} borderWidth={2} padding={10} onClick={()=>{inputref.current?.click()}}>
                                <Input onChange={(e)=>{arraypreview(e?.target?.files)}} ref={inputref} display={'none'} type='file' multiple/>
                                <Text color={'gray'} fontSize={12}>Enviar documentos</Text>
                              </Box>
                              <Box gridTemplateColumns={'repeat(auto-fit, minmax(50px, 1fr))'} width={'100%'} display={'grid'}>
                                {previewdocs?.files?.map((item:any, index:any)=>{
                                  return(
                                    <Box position={'relative'} key={index}>
                                      <Button right={8} top={0} position={'absolute'} borderRadius={50} bg={'red'} color={'white'} 
                                      fontSize={10} size={'2xs'} onClick={()=>{deletefile(item?.name)}}>X</Button>
                                      
                                      <Box>
                                        <Image src={'/icons/file.svg'} width={50} height={50} alt='file'/>
                                        </Box>
                                      <Text color={'gray'} fontSize={10}>{item?.name?.slice(0,10)}</Text>
                                    </Box>
                                  )
                                })}
                              </Box>
                              <Text textDecoration={'underline'} fontSize={12} color={'gray'}>Porfavor baixe o livro guia para agentes e intermediário. Clicando abaixo</Text>
                              <Box onClick={download} cursor={'pointer'} position={'relative'}>
                                <Image src={'/images/livro.png'} width={100} height={100} alt='livro-guia-para-agentes-&-intermediarios'/>
                                <Button color={'white'} bg={'#1cc995'} size={'2xs'}>baixar livro</Button>
                              </Box>
                              <Button onClick={submit} bg={'blue'}>Submeter Aplicação</Button>
                            </VStack>
                    </VStack>
                  </CustomHouseRegisterForm>
        </Box>
        <Toaster/>
    </VStack>
  )
}

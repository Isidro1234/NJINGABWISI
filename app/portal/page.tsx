"use client"
import CustomCard from '@/components/custom/CustomCard'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Property from '../../public/icons/imovel.svg'
import Coin from  '../../public/icons/coin.svg'
import CustomPCard from '@/components/custom/CustomPCard'
import CustomECard from '@/components/custom/CustomECard'
import UIP from '../../public/icons/uip.svg'
import Image from 'next/image'
import CustomUipCard from '@/components/custom/CustomUipCard'
import CustomGovCard from '@/components/custom/CustomGovCard'
import CustomReCard from '@/components/custom/CustomReCard'
import CustomMeuUIP from '@/components/custom/CustomMeuUIP'
import { useAuthContext } from '@/context/authContext'
import CheckoutForm from '@/components/custom/CheckoutForm'
import { EmbeddedCheckout } from '@stripe/react-stripe-js'
import UIPprint from '@/components/custom/UIPprint'
import { printing_pdf } from '@/logic/printpdf'
import { Toaster , toaster } from '@/components/ui/toaster'
import { useLogicState } from '@/states/useLogicState'
import { decryptdata } from '@/logic/encryptdata'
import { auth } from '@/config/firebse'
import CustomCardAgentI from '@/components/custom/CustomCardAgentI'
export default function Portal() {
  const casas_registradas = useLogicState((state:any)=>state?.getImoveisRegistrado)
  const {userdata}:any = useAuthContext();
  const [casas, setcasas] = useState([])
  const meu_registo = useLogicState((state:any)=>state.getagenteregisto);
  const [agente , setagente] = useState<any>([])
  const refpdf = useRef(null)
  useEffect(()=>{
     async function getting(){
      const saved_data:any = localStorage.getItem('agentstatus');
      if(saved_data){
         const decrypt = decryptdata(saved_data);
         if(decrypt?.length >=0){
        setagente(decrypt || [])
        }
      }else{
          const data = await meu_registo();
          setagente(data || [])
      }
      const res =await casas_registradas(userdata?.id)
      if(!res) return;
      setcasas(res)
     }
     getting()
  }, [])
 

  function downloadUIP(){
     if(!userdata?.photo){
      toaster.create({
        title:'Porfavor adicione uma foto no seu UIP',
        description:'So e possivel baixar o UIP com foto, porfavor insira uma foto',
        type:'warning',
        duration:5000
      })
      return
     }
     const download = printing_pdf(refpdf, userdata?.nome)
  }
  console.log(agente)
  return (
    <HStack className='portal-conteiner' display={'grid'} gridTemplateColumns={'repeat(auto-fit, minmax(350px,1fr))'} 
    alignItems={'flex-start'} width={'100%'}  bg={'#f6f6f6'} padding={10}>
      <CustomCard link='portal/propriedades' description='inta inc' title='Meus Imóveis' 
      icon={<Image src={'/icons/imovel.svg'} alt='imovel' width={30} height={30}/>}
       bg={'#E3EAFA'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
            <Text fontSize={12} color={'gray'}>Lista de propriedades</Text>
             {casas.map((item:any, index:any)=>{
              return(
                <CustomPCard image={item?.formulario_imovel?.fotos_da_propriedade[2]} estado={item?.estado} location={item?.formulario_imovel?.utente_rua?.slice(0,21)} name={"Imovel" + " " +item?.formulario_imovel?.utente_distrito?.slice(0,10)} key={index}/>
              )
             })}
            
        </VStack>
      </CustomCard>
      <CustomCard bg={'#f6f6f6'} link='portal/Agentes' title='Agentes' 
      description='inta inc'
      icon={<Image src={'/icons/agent-logo.svg'} alt='imovel' width={30} height={30}/>}>
          {(agente.length <= 0) ?
            <VStack width={'100%'}>
              <Text lineHeight={1.0} width={'100%'} textAlign={'center'} fontSize={12} color={'gray'}>Aplique pra ser um Agente</Text>
              <Text lineHeight={1.0} textAlign={'center'} fontSize={12} color={'gray'}>clique a baixo para aplicar para uma conta de agente</Text>
              <Button   bg={'blue'} fontSize={10} borderRadius={50}>Aplicar para Agente Imobiliario</Button>
            </VStack>
            :
            <VStack alignItems={'start'} width={'100%'}>
              <Text  fontSize={12} color={'gray'}>Meu perfil Agente</Text>
              <CustomCardAgentI estado={agente[0]?.estado} location={"de " + agente[0]?.formulario?.provincia} name={auth.currentUser?.displayName?.slice(0,15) || ''} image={auth.currentUser?.photoURL || ''}/>

            </VStack>
          }

            
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
      <CustomCard link='portal/Registrar' description='inta inc' title='Registar Imóvel' 
      icon={<Image src={'/icons/registar.svg'} alt='uip' width={25} height={25}/>}
       bg={'#e9daf9'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <CustomReCard/>
        </VStack>
      </CustomCard>
      <CheckoutForm/>
      
      <CustomCard link='portal/FuncionariosGov' description='inta inc' title='Funcionarios Gov' 
      icon={<Image src={'/icons/gov.svg'} alt='uip' width={25} height={25}/>}
       bg={'#DFFCE7'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={2} gap={4}>
            <Text fontSize={12} color={'gray'}>Actuais Funcioarios Gov</Text>
            <CustomGovCard/>
        </VStack>
      </CustomCard>
      <CustomCard link='portal/MeuUIP' description='inta inc' title='Meu PIU/UIP' 
      icon={<Image src={'/icons/stats.svg'} alt='uip' width={25} height={25}/>}
       bg={'#ebdffc'}>
        <VStack   alignItems={'flex-start'} width={'100%'} height={'100%'} paddingTop={5} gap={4}>
            <CustomMeuUIP userdata={userdata}/>
            <Box position={'fixed'}
  top={'-9999px'}
  left={'-9999px'}
  zIndex={-1}>
              <UIPprint ref={refpdf}/>
            </Box>
            <Button bg={'#419f5b'} fontWeight={400} fontSize={10} size={'2xs'} onClick={downloadUIP}  borderRadius={5}>baixar em pdf</Button>
        </VStack>
      </CustomCard>
      <Toaster/>
    </HStack>
  )
}
